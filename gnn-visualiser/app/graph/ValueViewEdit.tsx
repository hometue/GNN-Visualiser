import { ChangeEventHandler, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";

function InputBox(props: {value: number, onChange?: ChangeEventHandler<HTMLInputElement>, onEndEdit: () => void}){
	const wrapperRef = useRef<any>(null);
	useEffect(() => {
		// Alert if clicked on outside of element
		function handleClickOutside(event: any) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				props.onEndEdit();
			}
		}
		wrapperRef.current.focus();
		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [props]);

	const enterEndEdit = (e: KeyboardEvent<HTMLElement>) => {
		if(e.key === "Enter"){
			props.onEndEdit();
		}
	}
	return(
		<input type="number" value={props.value} onChange={props.onChange} onKeyDown={enterEndEdit} ref={wrapperRef} />
	)
}

export default function ValueViewEdit(props: {value: number, updateGraph: (value: number) => void}){
	const [editingVal, setEditingVal] = useState<null|number>(null);

	if(editingVal === null){
		const onClick = (e: MouseEvent<HTMLDivElement>) => {
			setEditingVal(props.value);
		}
		return(
			<span onClick={onClick}>
				{props.value.toString()}&nbsp;
			</span>
		)
	}
	else{
		const onEndEdit = () => {
			props.updateGraph(editingVal);
			setEditingVal(null);
		}
		const stringToInt = (str: string) => {
			const result = parseInt(str);
			if(isNaN(result)){
				return 0;
			}
			else{
				return result;
			}
		}

		return(
			<InputBox value={editingVal} onChange={(e) => {setEditingVal(stringToInt(e.target.value))}} onEndEdit={onEndEdit} />
		)
	}
}