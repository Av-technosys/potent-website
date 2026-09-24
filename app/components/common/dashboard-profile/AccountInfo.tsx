interface Props {
  user: {
    emailVerified?: boolean | null;
    createdAt?: string | Date | null;
  };
}

export const AccountInfo = ({ user }: Props) => {
  const isActive = user.emailVerified;

const formattedDate = (() => {
  if (!user.createdAt) return "-";

  const date =
    user.createdAt instanceof Date
      ? user.createdAt
      : new Date(user.createdAt);

  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
})();
  return (
    <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
      <h3 className="text-[16px] font-bold text-[#2D3748] mb-6 uppercase tracking-wider">
        Account Information
      </h3>

      <div className="space-y-5">
        {/* Account Status */}
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-gray-500 font-medium">
            Account Status
          </span>

          <span
            className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
              isActive
                ? "bg-[#DCFCE7] text-[#15824D]"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isActive ? "active" : "inactive"}
          </span>
        </div>

        {/* Member Since */}
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-gray-500 font-medium">
            Member Since
          </span>

          <span className="text-[14px] font-semibold text-[#2D3748]">
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
};