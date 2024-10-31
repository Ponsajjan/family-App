export async function addUserAction(data) {
    // Extract form data
    const formData = new FormData(data);
    const user = {
        name: formData.get('name'),
        gender: formData.get('gender'),
        birth_date: {
            day: formData.get('birth_date'),
            month: formData.get('birth_month'),
            year: formData.get('birth_year'),
        },
        deceased: formData.get('deceased') === 'on',
        death_date: {
            day: formData.get('death_date'),
            month: formData.get('death_month'),
            year: formData.get('death_year'),
        },
        phone_number: formData.get('phone_number'),
        occupation: formData.get('occupation'),
        education: formData.get('education'),
        address: formData.get('address'),
    };

    // Add user to database or perform any server-side actions here
    console.log("User submitted:", user);

    // Optionally, return a response or redirect after submission
    return { success: true };
}