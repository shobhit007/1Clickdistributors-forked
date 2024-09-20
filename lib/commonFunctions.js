export const formatUnderScoreString =  (string)=>{
    if(!string) return null;


    return string?.split("_")?.join(" ");
}