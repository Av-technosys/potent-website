// category
export {
  createCategory,
  updateCategory,
  attachProductCategory,
  getCategories,
  getProductCategory,
  updateProductCategory,
  getCategoriesPagination,
  deleteCategory,
} from "./category/action";

export {
  createCoupon,
  updateCoupon,
  getCouponsPagination,
  getCouponById,
  deleteCoupon,
} from "./coupon/action";

export {
  getCheckoutPricing,
  calculateCheckoutPricingForUser,
} from "./checkout/action";

// order
export {
  fetchOrders,
  fetchOrderDetails,
  changeOrderStatus,
  updateOrderStatus,
  createOrder,
  createPendingCheckoutOrder,
  checkUserFirstOrder,
  createCancelRequest,
  createReturnRequest,
  updateCancelRequestStatus,
  updateReturnRequestStatus,
} from "./order/action";

export {
  getAddresses,
  createUserAddress,
  getUserAddressById,
  updateProfile,
  getProfile,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress,
  subscribeEmail,
} from "./user/action";

//cart
export {
  getCart,
  addToCart,
  removeFromCart,
  syncCartWithDatabase,
  updateCartItemQuantity,
  clearCart,
} from "./cart/action";

//profile

export { getUserProfile, updateUserProfile } from "./profile/action";

//auth
export {
  signIn,
  signUp,
  refreshToken,
  verifyOtp,
  confirmForgotPassword,
  resendOtp,
  forgotPassword,
} from "./auth/action";
export {
  addToWishlistDB,
  getWishlistDB,
  removeFromWishlistDB,
} from "./wishlist/action";

export { useFileUpload } from "./useFileUpload";

export {
  getProductSimilarProducts,
  getFullProduct,
  getBestSellingProducts,
  getCategoryName,
  getBrandBestSellingProducts,
  getBrandNewArrivalProducts,
  getQuizSuggestedProducts
} from "./product/action";

export {
  createReview,
  getProductReviews,
  toggleApproveReview,
  rejectReview,
  deleteReview,
  getReviewStats,
  getUserAllReviews,
} from "./review/action";

export {
  sendOrderConfirmationEmail,
  sendFirstPurchaseEmail,
  sendNewsletterEmail,
  sendUserExperienceEmail,
  sendShippingConfirmationEmail,
  sendrefillReminderEmail,
  sendRefillReminderEmail,
  sendDeliveryConfirmationEmail,
  sendCartAbandonmentEmail,
  sendOrderStatusUpdateEmail,
  sendWelcomeEmail
} from "./emailTemplates/action";


export {createSubscription,createPaymentGatewayPlan, CreatePaymentGatewaySubscription} from "./subscription/action"
