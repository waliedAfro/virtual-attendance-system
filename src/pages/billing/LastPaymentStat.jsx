import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

const LastPaymentStat = ({ transactions = [] }) => {
  const { t } = useTranslation("payment");

  const lastPaymentDate = useMemo(() => {
    const paidTransactions = transactions
      .filter((t) => t.status?.toLowerCase() === "paid")
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (paidTransactions.length === 0) return t("common.noData");

    const latestDate = new Date(paidTransactions[0].date);
    return latestDate.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  }, [transactions, t]);

  return (
    <div className="stat-item bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col gap-1">
        <span className="stat-label text-sm font-medium text-gray-500 uppercase tracking-wider">
          {t("paymentManagement.lastPayment")}
        </span>
        <span className="stat-value text-2xl font-extrabold text-gray-900">
          {lastPaymentDate}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1 text-green-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-tight">
          {t("paymentManagement.verifiedTransaction")}
        </span>
      </div>
    </div>
  );
};

export default LastPaymentStat;