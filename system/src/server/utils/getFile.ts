export const getFile = async (request: Request, fieldname: string) => {
    const formData = await request.formData();

    const file = formData.get(fieldname) as Blob | null;

    if (!file) throw new Error('No file');

    return [file, formData] as  [Blob, FormData];
};
