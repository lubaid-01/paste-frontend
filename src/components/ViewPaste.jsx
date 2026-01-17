import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useEffect, useState } from "react";
const ViewPaste = () => {
  const { id } = useParams();

  console.log(id)

  const pastes = useSelector((state) => state.paste.pastes);
  const [fetchedPaste, setFetchedPaste] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. Determine which paste to use: Redux or Fetched
  // If Redux has it, use it. Otherwise, use the one we fetched locally.
  const paste = pastes.find((p) => p._id === id) || fetchedPaste;

  useEffect(() => {
    // If we already have the paste from Redux, do nothing.
    if (pastes.length > 0){
      setLoading(false);
      return;
    }

    // If Redux is empty, we must fetch from API
    setLoading(true);
    axios
      .get(`/api/paste/${id}`, { withCredentials: true })
      .then((res) => {
        console.log("✅ API Success:", res.data);
        // 3. Update STATE (triggers re-render)
        setFetchedPaste(res.data.paste); 
      })
      .catch((err) => {
        console.log("❌ Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, pastes.length]); // Dependencies

  // 4. LOADING CHECK: Stop React from rendering the UI until we have data
  if (loading) {
    return <div className="p-10 text-center">Loading paste...</div>;
  }

  // 5. SAFETY CHECK: If loading finished but we still have no paste (e.g., 404 error)
  if (!paste) {
    return <div className="p-10 text-center text-red-500">Paste not found</div>;
  }

 

  console.log("Paste->",paste);
  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
      <div className="flex flex-col gap-y-5 items-start">
        <input
          type="text"
          placeholder="Title"
          value={paste.title}
          disabled
          className="w-full text-black border border-input rounded-md p-2"
        />
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
            {/* Circle and copy btn */}
            <div
              className={`w-fit rounded-t flex items-center justify-between gap-x-4 px-4`}
            >
              {/*Copy  button */}
              <button
                className={`flex justify-center items-center  transition-all duration-300 ease-in-out group`}
                onClick={() => {
                  navigator.clipboard.writeText(paste.content);
                  toast.success("Copied to Clipboard");
                }}
              >
                <Copy className="group-hover:text-sucess-500" size={20} />
              </button>
            </div>
          </div>

          {/* TextArea */}
          { paste.option === "text" ?  ( <textarea
            value={paste.content}
            disabled
            placeholder="Write Your Content Here...."
            className="w-full p-3  focus-visible:ring-0"
            style={{
              caretColor: "#000",
            }}
            rows={20}
          />) : (<Editor height="400px" language={paste.lang} value={paste.content} 
                    options={{
                      minimap: { enabled: false },
                       readOnly: true,
                      fontSize: 15,
                      lineNumbers: "on",
                    }}
                  />)}

        </div>
      </div>
    </div>
  );
};

export default ViewPaste;
