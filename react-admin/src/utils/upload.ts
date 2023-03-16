export const imageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ecommer');
    formData.append('cloud_name', 'djdosyhxm');

    const res = await fetch('https://api.cloudinary.com/v1_1/djdosyhxm/upload', {
        method: 'POST',
        body: formData,
    });

    const data = await res.json();
    return { url: data.secure_url };
};
