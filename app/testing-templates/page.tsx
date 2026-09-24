"use client";
import { sendCartAbandonmentEmail, sendDeliveryConfirmationEmail, sendFirstPurchaseEmail, sendNewsletterEmail, sendOrderConfirmationEmail, sendrefillReminderEmail, sendShippingConfirmationEmail, sendUserExperienceEmail, sendWelcomeEmail } from '@/helper';
import React from 'react';
import { toast } from 'sonner';

const Page = () => {
    const sendEmail = async ()=>{
        // await sendOrderConfirmationEmail("ravindrasinghrss2004@gmail.com","Ravindra Singh","123456","2024-06-20","Product A, Product B","$99.99")
        // toast.success("Email sent successfully")

        // await sendFirstPurchaseEmail("ravindrasinghrss2004@gmail.com","Ravindra Singh")
        // toast.success("Email sent successfully")

        // await sendNewsletterEmail("ravindrasinghrss2004@gmail.com","Ravindra Singh","https://www.potenthygiene.com/shop","https://www.potenthygiene.com/subscribe")
        // toast.success("Email sent successfully")

        // await sendUserExperienceEmail("ravindrasinghrss2004@gmail.com","Ravindra Singh","https://www.potenthygiene.com/review")
        // toast.success("Email sent successfully")

        // await sendShippingConfirmationEmail("ravindrasinghrss2004@gmail.com","123456","Ravindra Singh","https://www.potenthygiene.com/review","123456","FedEx")
        // toast.success("Email sent successfully")

        // await sendrefillReminderEmail("ravindrasinghrss2004@gmail.com","Ravindra Singh","123456","Product A, Product B","2024-06-20","2024-06-20","https://www.potenthygiene.com/review")
        // toast.success("Email sent successfully")

        // await sendDeliveryConfirmationEmail("ravindrasinghrss2004@gmail.com","Ravindra Singh","123456","2024-06-20","https://www.potenthygiene.com/review");
        // toast.success("Email sent successfully")

        // await sendCartAbandonmentEmail("ravindrasinghrss2004@gmail.com","Ravindra Singh","Product A, Product B","https://www.potenthygiene.com/dashboard/orders","https://www.potenthygiene.com/review");
        // toast.success("Email sent successfully")

        await sendWelcomeEmail("ravindrasinghrss2004@gmail.com","Ravindra Singh");
        toast.success("Email sent successfully")
    }
    return (
        <>
            <button onClick={sendEmail}>Send Email</button>
        </>
    );
}

export default Page;
