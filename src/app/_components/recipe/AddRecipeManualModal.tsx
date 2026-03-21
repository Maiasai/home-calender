//レシピ登録モーダル（オリジナルレシピを入力）

'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { RecipeFormValues } from "@/app/_components/recipe/_types/RecipeFormValues"
import { supabase } from "@/_libs/supabase"
import { useSupabaseSession } from "@/app/home/hooks/useSupabaseSession"
import IngredientList from "./components/IngredientList"
import StepList from "./components/StepList"
import ImageUpload from "./components/ImageUpload"
import useSteps from "./hooks/useSteps"
import TitleForm from "./components/TitleForm"
import MemoForm from "./components/MemoForm"
import { Unit } from "./_types/Unit"
import CategorySelector from "./components/CategorySelector"
import { RecipeCategory } from "generated/prisma"

type Props = {
  onClose: () => void
}

const AddRecipeManualModal = ({
  onClose
}:Props) => {
  const {token} = useSupabaseSession()

  const [ category , setCategory ] = useState<RecipeCategory|"">("")
  const [ previewUrl, setPreviewUrl ] = useState<string | null>(null);
  const [ units , setUnits ] =  useState<Unit[]>([])//ここで選択肢を管理
  const [ loading, setLoading ] = useState<boolean>(false)
  
  
  const { register , setValue ,   handleSubmit  , control ,  formState :{errors,isValid} , reset  } = useForm < RecipeFormValues > (//ここにunitは入力フォームではないから不要
    {
    mode : "onChange",//inputの値が変わると発火→RHFが値を検証→formState.isValid 更新　※isValidをリアルタイムで使う時だけ必要。
    defaultValues:{
      title:"",
      memo:"",
      servings: undefined,
      thumbnailImageUrl:"",

      ingredients : [{
        name : "",
        amount:undefined,
        unitId:""//材料入力欄を１つ表示するためのもの
      }],

    }
    }
  )  


  // 材料と手順の hooks
  // const { ingredients ,  setIngredients, addIngredient , removeIngredient  } = useIngredients()
  const { steps, setSteps ,  addStep , removeStep } = useSteps()

  //onChangeイベント(手順)
  const recipeStepChange = ( index : number ,  value : string)=>{//onChangeから渡ってきたデータをここの関数で受け取る
    const newRecipeStep = [...steps]//配列をコピー(ここで新しい配列を作ることでReactに検知させる)
    newRecipeStep[index].recipestep = value //valueをmapで送られてきた理解した流れindex番号の[field]に代入する
    setSteps(newRecipeStep)//新しい配列でstateを更新→reactが再レンダリング→入力欄のvalueに反映される
  }
    

  //材料の量単位を取得
  useEffect(()=>{
    const fetchUnits = async () => {
      const res = await fetch("/api/units")
      const data = await res.json()
      setUnits(data)
      console.log("dataUI",data)
    }
    fetchUnits()
  },[])//[]の意味：画面が初回表示された時だけ実行



  const onSubmit = async ( data : RecipeFormValues ) => {
    setLoading(true)

    //useStateとuseFormの値をsubmit時にpayloadで合体
    const payload = {
      ...data, //useFormの値(フォームに入力された値)
      steps,
      category:category || undefined,
      servings: Number(data.servings) // 念のため明示的に数値化
    }
    const result = await supabase.auth.getSession()
    console.log('payload',payload)

    try{
      const res = await fetch('/api/recipes',{
        method : "POST",
        credentials: 'include', // cookie を送る
        headers:{
          'Content-Type':'application/json',
        },
          body :  JSON.stringify(payload)
      })

      if(!res.ok){//HTTPステータスコードが200-299の時trueになる
        const text = await res.text();
        throw new Error (`HTTP ${res.status}-${text}`)
      }

      //成功だった場合
      const d = await res.json()
      alert("レシピを登録しました！");
      reset(); //成功したら入力欄をクリア

      setPreviewUrl("")

      setSteps([
        { recipestep: "" }
      ])
      setCategory("")
      onClose()

    } catch (err:any) {

      console.error(err.message);

    }finally{

      setLoading(false)

    }
  };


return(
  <div className="bg-gray-100 w-[600px] max-h-[80vh] overflow-y-auto">
    <div>

    {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          読み込み中...
        </div>
      )}


    <form
      onSubmit={handleSubmit(onSubmit)}
    >

      <div className="flex items-center h-[250px] gap-6 bg-white m-5 p-4 rounded-lg">
        {/* 画像 */}
        <ImageUpload
          control={control}
          setValue={setValue}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
        />

        {/* タイトル (必須)*/}
        <TitleForm
          registerTitle={register}
          errors={errors}
        />
      </div>

      {/* カテゴリ */}
      <div className="flex items-center h-[80px] gap-6 bg-white m-5 p-4 rounded-lg">
        <CategorySelector
          category={category}
          setCategory={setCategory}
        />
      </div>

      {/* 人数・材料 (必須)*/}
      <div className="flex items-center gap-6 bg-white m-5 p-4 rounded-lg">
        <IngredientList
          control={control}//{}内が親から渡すもの、左はprops名
          register={register}
          registerServings={register}
          errors={errors}
          setValue={setValue}
          units={units}
        />
      </div>

      {/* 手順 (必須) */}
      <div className="flex items-center gap-6 bg-white m-5 p-4 rounded-lg">
        <StepList
          steps={steps}
          addStep={addStep}
          removeStep={removeStep}
          recipeStepChange={recipeStepChange}
        />
      </div>
  

      {/* メモ */}
      <div className="flex items-center h-[150px] gap-6 bg-white m-5 p-4 rounded-lg">
        <MemoForm
          registerMemo={register}
        />
      </div>

      <div className="flex justify-center mb-6">
        <button
          type="submit" //このボタンが押されたらフォームを送信する
          disabled={!isValid} //バリデーション表示されている時tureになる→true時はボタン無効
        >
        <img
          src="/images/recipecreate.png"
          alt="レシピを登録する"
          width={160}
        />
        </button>
      </div>

    </form>
    </div>
  </div>
  )
}

export default AddRecipeManualModal;