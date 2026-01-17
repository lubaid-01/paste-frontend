import { Copy, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchPastes,addToPastes, updatePastes } from "../redux/pasteSlice";
import { useSearchParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { use } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const Home = () => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [searchParams, setSearchParams] = useSearchParams(); // Destructure useSearchParams
  const pasteId = searchParams.get("pasteId"); // Get pasteId from the search params
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const [option, setOption] = useState("text");
  const [lang, setLang] = useState("javascript");

  const createPaste = () => {
    const paste = {
      title: title,
      content: value,
      option: option,
      lang:lang,
       //_id:
      //   pasteId ||
      //   Date.now().toString(36) + Math.random().toString(36).substring(2),
      // createdAt: new Date().toISOString(),

    };

    if (pasteId) {
      // If pasteId is present, update the paste
    
      axios.put(`${API}/paste/${pasteId}`, paste, { withCredentials: true })
        .then((res) => {
          
          console.log("✅ Paste updated to DB:", res.data);
          dispatch(updatePastes(res.data.updatedPaste));
        })
        .catch((err) => {
          console.log("❌ Error updating paste to DB:", err.response?.data || err.message);
          toast.error("Paste could't be updated");
        });
      
    } else {
      // Update to db
      axios.post(`${API}/paste/`, paste, { withCredentials: true })
        .then((res) => {
          
          console.log("✅ Paste updated to DB:", res.data);
          dispatch(addToPastes(res.data.paste));
        })
        .catch((err) => {
          console.log("❌ Error adding paste to DB:", err.response?.data || err.message);
          toast.error("Paste could't be added");
        });
      
    }

    setTitle("");
    setValue("");

    // Remove the pasteId from the URL after creating/updating a paste
    setSearchParams({});
  };

  const resetPaste = () => {
    setTitle("");
    setValue("");
    setSearchParams({});
    // navigate("/");
  };
  // for update existing paste
  useEffect(() => {
    if (pasteId) {
      const paste = pastes.find((p) => p._id === pasteId);
      if (paste) {
        setTitle(paste.title);
        setValue(paste.content);
        setLang(paste.lang);
        setOption(paste.option);
      }
    }
  }, [pasteId, pastes]);

useEffect(() => {
    // 3. Only fetch if the pastes array is empty
    if (pastes.length === 0) {
      console.log("Fetching pastes from API...");
      axios
        .get(`${API}/paste/`, { withCredentials: true })
        .then((res) => {
          console.log("✅ pastes:", res.data);
          dispatch(fetchPastes(res.data.pastes));
        })
        .catch((err) => {
          console.log("❌ error:", err.response?.data || err.message);
          toast("Could't fetch pastes")
        });
    } else {
        console.log("⚡ Data already loaded in Redux, skipping fetch.");
    }
  }, []);



  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
      <div className="flex flex-col gap-y-5 items-start">
        <div className="w-full flex flex-row gap-x-4 justify-between items-center">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            // Dynamic width based on whether pasteId is present
            className={`${
              pasteId ? "w-[80%]" : "w-[85%]"
            } text-black border border-input rounded-md p-2`}
          />
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={createPaste}
          >
            {pasteId ? "Update Paste" : "Create My Paste"}
          </button>

        {pasteId &&  <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={resetPaste}
          >
            <PlusCircle size={20} />
          </button>}
        </div>

        <div
          className={`w-full flex flex-col items-start relative rounded bg-opacity-10 border border-[rgba(128,121,121,0.3)] backdrop-blur-2xl`}
        >
          <div
            className={`w-full rounded-t flex items-center justify-between gap-x-4 px-4 py-2 border-b border-[rgba(128,121,121,0.3)]`}
          >
            <div className="w-full flex gap-x-[6px] items-center select-none group">
              <div className="w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgb(255,95,87)]" />

              <div
                className={`w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgb(254,188,46)]`}
              />

              <div className="w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgb(45,200,66)]" />
            </div>
            { option === "code" && (  <div>
              <select name="lang" className="border-2 rounded-lg"  onChange={(e) => setLang(e.target.value)}>
                  <option value="javascript" >javascript</option>
                  <option value="python" >python</option>
                  <option value="java" >java</option>
                  <option value="c" >C</option>
                  <option value="cpp" >C++</option>

               </select>
            </div>)}

            <div className="">
               <select name="option" className="border-2 rounded-lg"  onChange={(e) => setOption(e.target.value)}>
                  <option value="text" >Text</option>
                  <option value="code" >Code</option>
               </select>
            </div>
            {/* Circle and copy btn */}
            <div
              className={`w-fit rounded-t flex items-center justify-between gap-x-4 px-4`}
            >
              {/*Copy  button */}
              <button
                className={`flex justify-center items-center  transition-all duration-300 ease-in-out group`}
                onClick={() => {
                  navigator.clipboard.writeText(value);
                  toast.success("Copied to Clipboard", {
                    position: "top-right",
                  });
                }}
              >
                <Copy className="group-hover:text-sucess-500" size={20} />
              </button>
            </div>
          </div>

          {/* TextArea and code area */}
          { option === "text" ?  ( <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write Your Content Here...."
            className="w-full p-3  focus-visible:ring-0"
            style={{
              caretColor: "#000",
            }}
            rows={20}
          />) : (<Editor height="400px" language={lang} value={value} onChange={(val) => setValue(val)}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 15,
                      lineNumbers: "on",
                    }}
                  />)}

        </div>
      </div>
    </div>
  );
};

export default Home;
