"use client";

import { CashRecordInterface, CashRecordType, CategoryInterface } from "@/entities/pigmoney/types";
import CashRecordCard from "./CashRecordCard";

interface CashRecordListProps {
  records: CashRecordInterface[];
  type: CashRecordType;
  categories: CategoryInterface[];
}

// 거래 목록 (수입 or 지출)
const CashRecordList = ({ records, type, categories }: CashRecordListProps) => {
  const title = type === CashRecordType.INCOME ? "수입" : "지출";
  const emptyMessage =
    type === CashRecordType.INCOME ? "수입 내역이 없습니다." : "지출 내역이 없습니다.";
  const borderColor = type === CashRecordType.INCOME ? "border-pigmoney-income" : "border-pigmoney-expense";

  return (
    <div className="flex-1">
      {/* 헤더 */}
      <div className={`mb-4 border-b-2 pb-2 ${borderColor}`}>
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-minimoku-neutral-bold ml-2 text-sm">({records.length}건)</span>
      </div>

      {/* 목록 */}
      <div className="flex flex-col gap-3">
        {records.length > 0 ? (
          records.map((record) => (
            <CashRecordCard key={record.id} data={record} categories={categories} />
          ))
        ) : (
          <div className="text-minimoku-neutral-bold py-10 text-center">{emptyMessage}</div>
        )}
      </div>
    </div>
  );
};

export default CashRecordList;
