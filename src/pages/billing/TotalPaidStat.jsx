import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

const TotalPaidStat = ({ transactions = [] }) => {
  const { t } = useTranslation("payment");

  const totalPaidYTD = useMemo(() => {
    const currentYear = new Date().getFullYear();

    const total = transactions.reduce((sum, transaction) => {
      const transactionDate = new Date(transaction.paidAt);
      const isPaid = transaction.status?.toLowerCase() === "successful";
      const isCurrentYear = transactionDate.getFullYear() === currentYear;

      if (isPaid && isCurrentYear) {
        return sum + (Number(transaction.amount) || 0);
      }
      return sum;
    }, 0);

    return new Intl.NumberFormat("en-QA", {
      style: "currency",
      currency: "QAR",
      minimumFractionDigits: 2,
    }).format(total);
  }, [transactions]);

  return (
    <div>
      <div>
        <span>{t("paymentManagement.totalPaidYTD")}</span>
        <span>{totalPaidYTD}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: "65%" }}
          ></div>
        </div>
        <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
          {new Date().getFullYear()} {t("paymentManagement.yearPeriod")}
        </span>
      </div>
    </div>
  );
};

export default TotalPaidStat;