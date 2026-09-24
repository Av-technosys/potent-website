
import axios from 'axios';
import { db } from '@/db'
import { product } from '@/db/schema'
import React from 'react'
import { v4 as uuid } from "uuid";
import { s3 } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { AWS_BUCKET } from '@/env';
import { eq } from 'drizzle-orm';


// export async function uploadImageToS3(imageUrl: string) {
//     // 1. DOWNLOAD IMAGE
//     const response = await axios.get(imageUrl, {
//         responseType: "arraybuffer",
//     });

//     // 2. CONVERT TO BUFFER
//     const buffer = Buffer.from(response.data);

//     // 3. GENERATE FILE NAME
//     const fileName = `products/${uuid()}.jpg`;

//     // 4. UPLOAD TO S3
//     await s3.send(
//         new PutObjectCommand({
//             Bucket: AWS_BUCKET,
//             Key: fileName,
//             Body: buffer,
//             ContentType: "image/jpeg",
//         })
//     );
//     // 5. RETURN S3 IMAGE URL
//     return fileName;
// }



const page = async () => {

    // const data: any = await db.select({ id: product.id, bannerImage: product.bannerImage }).from(product);
    // console.log(data);

    // // 2. UPLOAD PRODUCT IMAGES
    // const uploadedImages: any = await Promise.all(
    //     data.map(async (item: any) => {
    //         const uploadedUrl = await uploadImageToS3(item.bannerImage);

    //         return {
    //             id: item?.id,
    //             uploadedUrl: uploadedUrl
    //         };
    //     })
    // );

    // // 3. INSERT PRODUCT IMAGES
    // if (uploadedImages) {
    //     await Promise.all(uploadedImages.map(async (item: any) => {
    //         return db.update((product)).set({
    //             bannerImage: item.uploadedUrl
    //         }).where(eq(product.id, item.id))
    //     }))
    // }

    return (
        <div>page</div>
    )
}

export default page