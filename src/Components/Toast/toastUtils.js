export let setToastify;
export let setShowToast;

export const initialToast=(setToastifyFunc,setShowToastFunc)=>{
setToastify=setToastifyFunc;
setShowToast=setShowToastFunc;
}

export const setToast = (state, msg, pos) => {
  setToastify({ status: state, message: msg, position: pos });
  setShowToast(true);
};