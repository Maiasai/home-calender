//一行をドラッグ可能にするラッパー※子要素（children）を「動かせるようにする箱」

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GroupedItem } from '../_typs/GroupedItem';

type Props = {
  item: GroupedItem;
  children: (listeners: any) => React.ReactNode;
};

const SortableItem = ({ item, children }: Props) => {
  //item→データ、children→JSX
  //attributes→アクセシビリティ用属性、 listeners→ドラッグイベント
  //setNodeRef→DOMをdnd-kitに紐づける、 transform→移動量（x, y）、 transition→アニメーション
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id }); //ここで、この要素はドラッグ対象ですとdnd-kit に登録

  const style = {
    transform: CSS.Transform.toString(transform), //数値 → CSS文字列に変換
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children(listeners)}
    </div>
  );
};

export default SortableItem;
