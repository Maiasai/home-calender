//検索絞り込み項目(レシピ一覧)


type Props = {
  inputKeyword : string
  setInputKeyword : (v:string) => void
  setKeyword : (v:string) => void
  setRecipeModalOpen :  (v:boolean) => void
  setIsBulkMode : (v:boolean) => void
  isBulkMode : boolean
}

const SearchBar = ({
  inputKeyword,
  setInputKeyword,
  setKeyword,
  setRecipeModalOpen,
  setIsBulkMode,
  isBulkMode
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
    <button
      className = "w-[114px] h-[34px] rounded-lg border text-white bg-[#EB8A00]" 
      onClick={()=>setRecipeModalOpen(true)}
    >
      レシピ追加
    </button>

    <button
      className = "w-[149px] h-[34px] rounded-lg border text-white bg-[#EB8A00]" 
      onClick={()=>setIsBulkMode(!isBulkMode)}
    >
      一括操作モード
    </button>
    </div>

  )
}

export default SearchBar;