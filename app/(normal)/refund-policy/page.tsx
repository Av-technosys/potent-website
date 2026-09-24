

const Page = () => {
  return (
    <div className="min-h-screen w-full bg-white">

     


     
           <div className="w-full flex items-start justify-center bg-white py-16 px-0 md:px-8">
        <div className="w-full max-w-3xl flex flex-col items-center gap-10">

          <h1 className="text-3xl sm:text-4xl font-bold text-black text-center">
            Refund Policy
          </h1>

         
         <div className="w-full bg-[#F8F6F1] md:rounded-2xl rounded-none shadow-sm border border-neutral-200 p-6 sm:p-8 lg:p-10 space-y-6 text-neutral-800 leading-relaxed">

            <p>
              Thank you for your interest in Potent Hygiene products. To ensure a
              smooth shopping experience, please carefully review our refund
              policy before placing an order.
            </p>

            <div>
              <h2 className="font-bold text-black">
                We do not currently offer refunds, returns, or exchanges.
              </h2>
              <p className="mt-3">
                We understand that sometimes unforeseen circumstances may arise.
                However, due to the nature of our products (being personal hygiene
                products), we cannot accept returns or offer refunds once an
                order has been shipped.
              </p>
            </div>

            <div>
              <p className="font-semibold text-black">
                We strongly recommend that you:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Carefully review the product descriptions and specifications before placing an order.</li>
                <li>Select the correct item(s) and quantities for your needs.</li>
                <li>
                  If you have any questions about a product before you purchase it,
                  please contact us at care@potenthygiene and we will be happy to assist you.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-black">
                Your Satisfaction is Important to Us
              </h2>
              <p className="mt-3">
                While we do not offer refunds or returns, we are committed to
                your satisfaction. If you have any concerns about your order,
                please contact us at care@potenthygiene and we will do our best
                to address them.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-black">
                We reserve the right to modify this refund policy at any time.
              </h2>
              <p className="mt-3">Thank you for your understanding.</p>
            </div>

            <div>
              <h2 className="font-bold text-black">Exceptions</h2>
              <p className="mt-3">There are no exceptions to this policy.</p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Page;