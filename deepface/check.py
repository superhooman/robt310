import warnings
warnings.filterwarnings("ignore")

import argparse

from deepface import DeepFace
import os

def verify_access(user_image_path, permitted_users_folder):
    cwd = os.getcwd()
    permitted_users_images = [os.path.join(cwd, permitted_users_folder, f) for f in os.listdir(permitted_users_folder) if f.endswith(('.jpg', '.png'))]

    for permitted_user_image in permitted_users_images:
        result = DeepFace.verify(user_image_path, permitted_user_image, model_name='Facenet', enforce_detection = False)
        
        if result['verified']:
            permitted_user_name = os.path.splitext(os.path.basename(permitted_user_image))[0]
            return True, permitted_user_name 
        else:
            continue 
    
    return False, None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--file')
    parser.add_argument('--database')
    args = parser.parse_args()

    user_image_path = args.file
    permitted_users_folder = args.database

    result, permitted_user_name = verify_access(user_image_path, permitted_users_folder)
    if result:
        print('{"success": true, "id": "' + permitted_user_name + '"}')
    else:
        print('{"success": false}')

if __name__ == '__main__':
    main()
