/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs'); 
let content = fs.readFileSync('src/actions/admin.ts', 'utf8'); 
content += `\nexport async function updateStore(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  try {
    const storeId = formData.get('storeId') as string
    await prisma.store.update({
      where: { id: storeId },
      data: {
        name: formData.get('name') as string,
        storeNumber: formData.get('storeNumber') as string,
        floor: formData.get('floor') as string,
        categoryId: formData.get('categoryId') as string,
        description: formData.get('description') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        monthlyRent: parseFloat(formData.get('monthlyRent') as string),
        openingDate: new Date(formData.get('openingDate') as string),
        ownerId: (formData.get('ownerId') as string) || null,
      }
    })

    revalidatePath('/admin/stores')
    revalidatePath('/admin/stores/' + storeId)
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update store' }
  }
}`; 
fs.writeFileSync('src/actions/admin.ts', content);
