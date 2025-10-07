import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function useToastMessages({ error, success, warn=null }, { clearError, clearSuccess, clearWarn=null }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      if(clearError)
        dispatch(clearError());
    }
  }, [error, dispatch, clearError]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());
    }
  }, [success, dispatch, clearSuccess]);

  useEffect(() => {
    if (warn) {
      toast.warn(warn);
      dispatch(clearWarn());
    }
  }, [warn, dispatch, clearWarn]);
}


