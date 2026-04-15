//検索絞り込み項目（献立作成モーダル)
'use client'

type Props = {
  inputKeyword : string
  setInputKeyword : (v:string) => void
  setKeyword : (v:string) => void
}

const SearchBarSimple = ({
  inputKeyword,
  setInputKeyword,
  setKeyword,
}:Props) =>{

  return(
    <div className = "flex justify-center mb-4 gap-">
      <input 
        value={inputKeyword}
        onChange={(e)=>setInputKeyword(e.target.value)}
        onKeyDown={(e)=>{//エンターでも検索実行可能
          if(e.key==="Enter"){
            setKeyword(inputKeyword)
          }
        }}
        className= "pl-5 w-[259px] h-[37px] border border-gray-300 rounded-lg"
        placeholder="レシピ名、食材から探す" 
      />

      <button 
        className = "w-[114px] h-[34px] rounded-lg border text-[#E4A000] bg-[#FFF8EB]" 
        onClick={()=>setKeyword(inputKeyword)}  
      >
        検索
      </button>
    </div>
  )
}

export default SearchBarSimple;