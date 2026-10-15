/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Package, Calendar, User, MapPin } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Select } from "@/components/select";
import { updateOrderStatus } from "@/helper/index";
import { ORDER_STATUS_ITEMS } from "@/const/globalconst";
import { toast } from "sonner";
import { formatMixBoxRecipe } from "@/lib/mixYourBox";
import { formatYatraKitContents } from "@/lib/yatraKit";

interface OrderTableProps {
  page: number;
  orders: any[];
  pageSize: number;
}

function formatOrderDate(dateVal: any) {
  if (!dateVal) return "-";
  try {
    const d = new Date(dateVal);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return String(dateVal);
  }
}

function renderMixBoxRecipe(recipe: any) {
  if (!recipe) return null;
  if (recipe.type === "yatraKit" || recipe.kitId) {
    return (
      <div className="mt-0.5 text-[11px] font-semibold text-[#116B66] bg-[#EAF6F4] rounded px-1.5 py-0.5 inline-block">
        {formatYatraKitContents(recipe)} · Free Wipes ({recipe.freeWipesCount || 10})
      </div>
    );
  }
  const line = formatMixBoxRecipe(recipe);
  if (!line) return null;
  return (
    <div className="mt-0.5 text-[11px] font-semibold text-[#7E4D77] bg-[#F3E6F0] rounded px-1.5 py-0.5 inline-block">
      {line}
    </div>
  );
}

const OrderTable = ({ page, orders, pageSize }: OrderTableProps) => {
  const startIndex = (page - 1) * pageSize;
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-12 font-semibold text-slate-700">#</TableHead>
            <TableHead className="min-w-[150px] font-semibold text-slate-700">Order ID & Date</TableHead>
            <TableHead className="min-w-[180px] font-semibold text-slate-700">Customer</TableHead>
            <TableHead className="min-w-[280px] font-semibold text-slate-700">Items to Pack</TableHead>
            <TableHead className="min-w-[140px] font-semibold text-slate-700">Status</TableHead>
            <TableHead className="min-w-[180px] font-semibold text-slate-700">Shipping Address</TableHead>
            <TableHead className="min-w-[110px] font-semibold text-slate-700">Amount</TableHead>
            <TableHead className="w-20 text-end font-semibold text-slate-700">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders && orders.length > 0 ? (
            orders.map((order: any, index: number) => {
              const rowNumber = Number(startIndex) + index + 1;
              const items = Array.isArray(order.items) ? order.items : [];

              return (
                <TableRow
                  key={order.id || rowNumber}
                  className={`hover:bg-slate-50/70 transition-colors align-top ${
                    updatingOrderId === order.id ? "opacity-60" : ""
                  }`}
                >
                  {/* S.No */}
                  <TableCell className="font-medium text-slate-500 py-3.5">
                    {rowNumber}
                  </TableCell>

                  {/* Order ID & Date */}
                  <TableCell className="py-3.5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-semibold text-slate-900 bg-slate-100 rounded px-1.5 py-0.5 w-fit">
                          {order.id ? `#${order.id.slice(0, 8)}...` : "-"}
                        </span>
                        {order.returnRequest && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 rounded px-1.5 py-0.5 w-fit">
                            ⚠️ Issue: {order.returnRequest.status || "pending"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{formatOrderDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Customer Details */}
                  <TableCell className="py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 font-medium text-sm text-slate-900">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{order.customerName || "Customer"}</span>
                      </div>
                      {order.customerPhone && (
                        <span className="text-xs text-slate-600 font-mono pl-5">
                          {order.customerPhone}
                        </span>
                      )}
                      {order.customerEmail && (
                        <span className="text-[11px] text-slate-500 truncate max-w-[180px] pl-5" title={order.customerEmail}>
                          {order.customerEmail}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Items to Pack */}
                  <TableCell className="py-3.5">
                    {items.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {items.map((item: any, itemIdx: number) => (
                          <div
                            key={item.id || itemIdx}
                            className="flex flex-col text-xs border-b border-slate-100 pb-1.5 last:border-b-0 last:pb-0"
                          >
                            <div className="flex items-start gap-1.5">
                              <span className="inline-flex items-center justify-center font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded text-[11px] shrink-0">
                                x{item.quantity ?? 1}
                              </span>
                              <span className="font-medium text-slate-800 leading-snug">
                                {item.productVarientName || "Item"}
                              </span>
                            </div>

                            {item.productVarientSKU && (
                              <span className="text-[10px] text-slate-400 font-mono mt-0.5 pl-6">
                                SKU: {item.productVarientSKU}
                              </span>
                            )}

                            {item.mixBoxRecipe && (
                              <div className="pl-6">
                                {renderMixBoxRecipe(item.mixBoxRecipe)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-slate-300" />
                        No item details
                      </span>
                    )}
                  </TableCell>

                  {/* Status Dropdown */}
                  <TableCell className="py-3.5">
                    <div className="min-w-[130px]">
                      <Select
                        placeholder="Status"
                        label="Status"
                        value={order.status}
                        selectItems={ORDER_STATUS_ITEMS}
                        onValueChange={(value) => {
                          setUpdatingOrderId(order.id);
                          startTransition(async () => {
                            try {
                              await updateOrderStatus(order.id, value);
                              toast.success("Order status updated");
                              router.refresh();
                            } catch (e: any) {
                              toast.error(e?.message || "Failed to update status");
                            } finally {
                              setUpdatingOrderId(null);
                            }
                          });
                        }}
                      />
                    </div>
                  </TableCell>

                  {/* Address */}
                  <TableCell className="py-3.5 text-xs text-slate-600">
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span>{order.addressLine1 || "-"}</span>
                        {(order.city || order.pincode) && (
                          <span className="text-slate-500 text-[11px]">
                            {[order.city, order.state, order.pincode].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Total Amount */}
                  <TableCell className="py-3.5 font-semibold text-slate-900 text-sm">
                    {order.totalAmount != null ? `₹${order.totalAmount}` : "-"}
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right py-3.5">
                    <button
                      onClick={() => router.push(`${pathname}/${order.id}`)}
                      className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 transition cursor-pointer"
                      aria-label="View details"
                      title="View Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-28 text-center text-slate-500">
                <div className="flex flex-col items-center justify-center gap-1">
                  <Package className="w-6 h-6 text-slate-400" />
                  <p className="font-medium text-slate-600">No orders found.</p>
                  <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
