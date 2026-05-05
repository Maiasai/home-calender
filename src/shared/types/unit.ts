//単位　型定義

export type UnitData = {
  id: string;
  name: string;
};

//単位　レスポンス型
export type GetUnitsResponse = {
  units: UnitData[];
};
