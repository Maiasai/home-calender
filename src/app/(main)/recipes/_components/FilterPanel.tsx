//お気に入りと作ったことある絞り込み

import { Bookmark, Heart } from 'lucide-react';

type Props = {
  favoriteFilter: boolean;
  setFavoriteFilter: (v: boolean) => void;
  cookedFilter: boolean;
  setCookedFilter: (v: boolean) => void;
};

const FilterPanel = ({
  favoriteFilter,
  setFavoriteFilter,
  cookedFilter,
  setCookedFilter,
}: Props) => {
  return (
    <div className="flex flex-col gap-y-2 mb-2">
      <div className="flex justify-center items-center gap-2">
        <div>
          <label className="flex text-sm items-center">
            {/* labelを使うとクリック範囲を広げられる */}
            <input
              type="checkbox"
              checked={favoriteFilter}
              onChange={(e) => setFavoriteFilter(e.target.checked)}
            />
            <div className="ml-2">お気に入りを絞り込み</div>
          </label>
        </div>

        <Heart size={24} color="#ff5b99" fill="#ff5b99" />
      </div>

      <div className="flex justify-center gap-2">
        <label className="flex text-sm items-cente">
          {/* labelを使うとクリック範囲を広げられる */}
          <input
            type="checkbox"
            checked={cookedFilter}
            onChange={(e) => setCookedFilter(e.target.checked)}
          />
          <div className="ml-2">作ったことがある絞り込み</div>
        </label>

        <Bookmark size={24} color="#fecb3e" fill="#fecb3e" />
      </div>
    </div>
  );
};

export default FilterPanel;
