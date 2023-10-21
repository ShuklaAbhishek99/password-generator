import { useState, useCallback, useEffect, useRef } from "react";

function App() {
  const [length, setLength] = useState(8);
  const [numAllowed, setNumAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("Password");
  const [isCopy, setIsCopy] = useState("");

  // useRef hook, using to copy password to clipboard
  const passwordRef = useRef(null);

  // whenever the length, charAllowed, numAllowed changes we have call the password generator
  // which will generate the new password
  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (numAllowed) str += "0123456789";
    if (charAllowed) str += "~`!@#$%^&*()_+=[]{}";

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }

    setPassword(pass);
  }, [length, numAllowed, charAllowed, setPassword]);
  // we used setPassword instead of password, because choosing password will create
  // an infinite loop where password keep on changing, so we choose setPassword
  // you can also choose to not give setPassword but it is given for memoization(memory related)
  // this just optimizes

  // whenever any change happens in either of 4 dependencies this will be hit
  // we can't directly call the passwordGenerator() this will hit the infinite render
  // to solve that we are calling passwordGenerator() with useEffect
  useEffect(() => {
    passwordGenerator();
    setIsCopy("Copy");
  }, [length, numAllowed, charAllowed, passwordGenerator]);

  const copyPasswordToClipBoard = useCallback(() => {
    // this will highlight the text selected by copy button
    passwordRef.current?.select();
    // this will select the values given, ex- 0 to 101
    passwordRef.current?.setSelectionRange(0, 101);
    // this will copy the value/password inside input
    window.navigator.clipboard.writeText(password);
  }, [password]);

  return (
    <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 text-orange-500 bg-gray-900">
      <h1 className="text-white text-center my-3">Password Generator</h1>
      <div className="flex shadow rounded-lg overflow-hidden mb-4">
        <input
          className="outline-none w-full py-1 px-3"
          type="text"
          value={password}
          placeholder="password"
          readOnly
          ref={passwordRef}
        />
        <button
          className="outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0 hover:bg-blue-800"
          onClick={()=>{copyPasswordToClipBoard(); setIsCopy("Copied")}}
        >
          {isCopy}
        </button>
      </div>
      <div className="flex text-sm gap-x-2">
        <div className="flex items-center gap-x-1">
          <input
            type="range"
            min={6}
            max={101}
            value={length}
            className="cursor-pointer"
            onChange={(e) => {
              setLength(e.target.value);
            }}
          />
          <label>Length({length}) </label>
        </div>
        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            defaultChecked={numAllowed}
            id="numberInput"
            className="cursor-pointer"
            onChange={() => {
              // if true then false, if false then true
              setNumAllowed((prev) => !prev);
            }}
          />
          <label htmlFor="numberInput">Numbers</label>
        </div>
        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            defaultChecked={charAllowed}
            id="charInput"
            className="cursor-pointer"
            onChange={() => {
              // if true then false, if false then true
              setCharAllowed((prev) => !prev);
            }}
          />
          <label htmlFor="charInput">Characters</label>
        </div>
      </div>
    </div>
  );
}

export default App;
