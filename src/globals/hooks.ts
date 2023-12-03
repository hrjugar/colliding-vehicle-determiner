import { useContext, useEffect } from "react";
import { ModalContext } from "../contexts/ModalContext";

export function useModal() {
  const context = useContext(ModalContext)!
  return context
}

export function useOutsideAlerter(ref: React.MutableRefObject<any>, callback: Function) {
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target)) {
        console.log("Clicked outside the element.")
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref]);
}