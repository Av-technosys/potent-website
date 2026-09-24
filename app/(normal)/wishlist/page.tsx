
import WishlistProducts from "../../components/common/wishlist/WishlistProducts"

export default function Page(){

  return(
    <div>


      <div className="max-w-7xl md:mx-12 mx-auto py-10 px-6">

        <h1 className="text-2xl font-bold mb-8">
         You May Also Like
        </h1>

        <WishlistProducts/>

      </div>


    </div>
  )
}