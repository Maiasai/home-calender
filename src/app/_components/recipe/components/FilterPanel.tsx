//お気に入りと作ったことある絞り込み


type Props = {
  favoriteFilter : boolean
  setFavoriteFilter : (v:boolean) => void
  cookedFilter : boolean
  setCookedFilter : (v:boolean)=> void
}

const FilterPanel = ({
  favoriteFilter,
  setFavoriteFilter,
  cookedFilter,
  setCookedFilter
}:Props)=>{

  return(
    <div className="flex flex-col gap-y-2 mb-4">
      <div
        className="flex justify-center items-center gap-2">
        <div>
          <label
            className="flex text-sm items-center"
          >{/* labelを使うとクリック範囲を広げられる */}
            <input
              type="checkbox"
              checked={favoriteFilter}
              onChange={(e)=>setFavoriteFilter(e.target.checked)}

            />
            <div className="ml-2">
              お気に入りを絞り込み
            </div>
          </label>
        </div>
        <img 
          src="/images/Heart01.png"
          alt="お気に入りアイコン"
          width={20}
          height={0}
        />
      </div>

      <div
        className="flex justify-center gap-2">
        <label
          className="flex text-sm items-cente"
        >{/* labelを使うとクリック範囲を広げられる */}
          <input
            type="checkbox"
            checked={cookedFilter}
            onChange={(e)=>setCookedFilter(e.target.checked)}
          />
          <div className="ml-2">
            作ったことがある絞り込み
          </div>
        </label>
        <img 
          src="/images/bookmark01.png"
          alt="作ったことあるアイコン"
          width={20}
          height={20}
        />
      </div>
    </div>
  )
}

export default FilterPanel;