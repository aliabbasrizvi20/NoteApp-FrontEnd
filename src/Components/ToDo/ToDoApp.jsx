import { useEffect, useState } from "react";
import "./ToDo.css";
import profile from "../ToDo/profile.png";
import Add from "./plus.png";
import SearchIcon from "./search-interface-symbol.png";
import CloseIcon from "./close-circle-svgrepo-com.svg";
import Edit from "./pen.png";
import Del from "./delete-svgrepo-com.svg";
import DeleNote from "./DeletedNotes";
import { Link, Navigate, useNavigate } from "react-router-dom";
import pin from "./pin (1).png";
import unpin from "./pin.png";
import lightMode from "./day-mode.png";
import nightMode from "./moon-and-stars.png";
import axiosClient from "../../api/axiosClient";

export default function ToDoApp() {
  const nav = useNavigate();
  // const [value, setValue] = useState('');

  const [itemlist, setItemList] = useState([]);
  const [noteColors, setNoteColors] = useState(false);
  const [choosenColor, setChoosenColor] = useState("");
  const [showNotePad, setShowNotePad] = useState(false);
  const [notesData, setNotesData] = useState("");
  const [searchNoteData, setSearchNoteData] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);
  const [editId, setEditId] = useState(false);
  const [textUnderline, setTextUnderline] = useState(false);
  const [deletedNote, setDeletedNote] = useState([]);
  const [showDeletedNotes, setShowDeletedNotes] = useState(false);
  //  const [pinNote,setPinNote]=useState(false);
  const [delforever, setDelForever] = useState(false);
  const [noDelNotes, setNoDelNotes] = useState(false);
  const [isMode, setIsMode] = useState("");
  //  const [isLight,setIsLight]=useState("");
  const [pinnedList, setPinnedList] = useState([]);
  const [noteIsLight, setNoteIsLight] = useState("");
  const [navUnderline, setNavUnderline] = useState("");
  const [userNameTheme, setUserNameTheme] = useState(false);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  useEffect(() => {
    if (!user) {
      const savedGuestNotes =
        JSON.parse(localStorage.getItem("guestNotes")) || [];
      setItemList(savedGuestNotes);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("guestNotes", JSON.stringify(itemlist));
    }
  }, [itemlist]);

  const getNotes = async () => {
    const notes = await axiosClient.get("/note");
    setItemList(notes.data.notes);
  };
  const deleteNote = async (id) => {
    const notes = await axiosClient.delete(`note/${id}`);
    getNotes();
  };
  const onAddNote = async (body) => {
    const notes = await axiosClient.post("/note", body);
    getNotes();
  };

  useEffect(() => {
    if (user) {
      getNotes();
    }
  }, [user]);

  const onAddList = () => {
    setShowDeletedNotes(false);
    setNoteColors(true);
    setNotesData("");
    setChoosenColor("");
    setEditIndex(null);
    setNoDelNotes(false);
    setEditId(null);
  };

  const onDeleteList = (id, index) => {
    if (user) {
      // Logged-in user — delete via API
      if (!id) return; // safety check
      deleteNote(id);
    } else {
      // Guest user — delete by index
      setItemList((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const onColorSelect = (color) => {
    setChoosenColor(color);
    setNoteColors(false);
    setShowNotePad(true);
  };
  const callEditApi = async (id) => {
    const body = {
      text: notesData,
    };
    await axiosClient.put(`/note/${id}`, body);
    getNotes();
  };
  const onSaveNote = () => {
    if (notesData.trim() === "") {
      alert("Please write something...");
      return;
    }
    // else{
    //   alert("Saved")
    // }

    const newNote = {
      text: notesData,
      color: choosenColor,
      bold: textBold,
      italic: textItalic,
      underline: textUnderline,
      isPinned: false,
    };

    if (user) {
      // LOGGED IN USER
      if (editId !== null) {
        callEditApi(editId);
      } else {
        onAddNote(newNote);
      }
    } else {
      // GUEST USER — FIXED
      if (editIndex !== null) {
        setItemList((prev) => {
          const updated = [...prev];
          updated[editIndex] = newNote;
          return updated;
        });
      } else {
        setItemList((prev) => [...prev, newNote]);
      }
    }
    setShowNotePad(false);
    setNotesData("");
    setChoosenColor("");
    setEditIndex(null);
    setEditId(null);
    setTextBold(false);
    setTextUnderline(false);
    setTextItalic(false);
  };

  const onNoteDataChange = (e) => {
    setNotesData(e.target.value);
  };

  const onSearchNote = (e) => {
    setSearchNoteData(e.target.value);
  };

  const onSearchedNotes = () => {
    const found = itemlist.some((note) =>
      note.text.toLowerCase().includes(searchNoteData.toLowerCase())
    );
    if (!found) alert("No matching note found.");
  };

  const getNotesList = () => {
    // console.log(itemlist, 'itemlist');
    const pinnedList = itemlist?.filter((item) => item.isPinned);
    const nonPinnedList = itemlist?.filter((item) => !item.isPinned);
    return [...pinnedList, ...nonPinnedList];
  };

  const onEditList = async (id, index) => {
    setChoosenColor(itemlist[index].color);
    setNotesData(itemlist[index].text);
    setTextBold(itemlist[index].bold || false);
    setTextItalic(itemlist[index] || false);
    setTextUnderline(itemlist[index].underline || false);
    setShowNotePad(true);
    setEditId(id);
    setEditIndex(index);
  };

  const onClickBold = () => {
    setTextBold(true);
  };
  const onBoldDoubleClick = () => {
    setTextBold(false);
  };
  const onClickItalic = () => {
    setTextItalic(true);
  };
  const onItalicDoubleClick = () => {
    setTextItalic(false);
  };
  const onClickUnderline = () => {
    setTextUnderline(true);
  };
  const onUnderlineDoubleClick = () => {
    setTextUnderline(false);
  };
  const onNoDelClick = () => {
    setDelForever(false);
  };

  const onShowDeletedNotes = () => {
    if (deletedNote.length === 0) {
      setNoDelNotes(true);
    } else {
      setShowDeletedNotes(true);
    }
  };

  const onPinNotes = (index) => {
    setItemList((prev) => {
      const updated = [...prev];
      const updatedNote = {
        ...updated[index],
        isPinned: !updated[index].isPinned,
      };
      updated[index] = updatedNote;
      return updated;
    });
    // if(!itemlist[index].isPinned){
    //     setPinnedList(prev => [...prev, itemlist[index]])
    // } else {
    //     setPinnedList(prev => {
    //         let updated = [...prev];
    //         updated.splice(index, 1);
    //         return updated;
    //     })
    // }
  };
  const onUnPinNotes = (index) => {
    console.log(index);
  };
  const onDeleteForever = () => {
    setDelForever(true);
  };
  const onDelNoteForever = (index) => {
    // console.log(index);
    setDeletedNote((prevDeleted) =>
      prevDeleted.filter((_, delIndex) => index !== delIndex)
    );
    setDelForever(false);
  };
  const setDarkMode = () => {
    setIsMode("isMode");
    setUserNameTheme(true);
    setNoteIsLight("note-dark");
    setNavUnderline("nav-design");
  };
  const setLightMode = () => {
    setIsMode("");
    setUserNameTheme(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setItemList([]);
    alert("Logged Out Successfully");
  };

  return (
    <div
      className={`parent-container`}
      style={{ backgroundColor: "whitesmoke" }}
    >
      {/* <div className="login">
               <Link to="/login"><button>LogIn</button></Link> 
            </div> */}
      <div className={`container ${isMode}`}>
        <div className={`nav-container ${navUnderline}`}>
          <div className={`logo `}>
            <h4 style={{ color: isMode ? "white" : "black" }}>Notethat.</h4>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              onChange={onSearchNote}
              value={searchNoteData}
            />
            <img
              src={SearchIcon}
              alt="Search"
              className="search-icon"
              onClick={onSearchedNotes}
            />
          </div>

          <div className="dropdown">
            <img src={profile} alt="" />
            {user ? <p>{user.name} </p> : ""}
            <div className="dropdown-content">
              <div className={`logins-btn  `}>
                {user ? (
                  <>
                    <p className={`${userNameTheme ? "IsUserDark" : ""}`}></p>
                    <button className="nologin-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login">
                    <button className="login-btn-btn">LogIn</button>
                  </Link>
                )}
                {/* <h3 onClick={onShowDeletedNotes}>Deleted Notes</h3> */}
              </div>
              <div className={`modes ${isMode} `}>
                <div className={`light ${isMode}`}>
                  <img src={lightMode} alt="" onClick={setLightMode} />
                </div>
                <div className="dark">
                  <img src={nightMode} alt="" onClick={setDarkMode} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="combine-container"
          style={{
            boxShadow:
              itemlist.length === 0
                ? "none"
                : "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
        >
          <div className="add-note-icon">
            <div className="add-icon">
              <img src={Add} alt="Add" onClick={onAddList} />
            </div>
          </div>

          {noteColors && (
            <div className="colors-note">
              <div
                className="span"
                onClick={() => onColorSelect("orange")}
              ></div>
              <div
                className="span1"
                onClick={() => onColorSelect("skyblue")}
              ></div>
              <div
                className="span2"
                onClick={() => onColorSelect("lightcoral")}
              ></div>
              <div
                className="span3"
                onClick={() => onColorSelect("lightpink")}
              ></div>
              <div
                className="span4"
                onClick={() => onColorSelect("thistle")}
              ></div>
              <div
                className="span5"
                onClick={() => onColorSelect("springgreen")}
              ></div>
              <div
                className="span6"
                onClick={() => onColorSelect("lightsalmon")}
              ></div>
              <div
                className="span7"
                onClick={() => onColorSelect("khaki")}
              ></div>
            </div>
          )}

          {showNotePad && (
            <div className="modal-overlay">
              <div className={`note-modal ${noteIsLight} ${isMode}`}>
                <div className="back-btns">
                  {/* <button onClick={()=>setShowNotePad(false)}>X</button> */}
                  <img
                    src={CloseIcon}
                    onClick={() => setShowNotePad(false)}
                    alt=""
                  />
                </div>
                <textarea
                  className={`${textBold ? "setBold" : ""} ${
                    textItalic ? "setItalic" : ""
                  } ${textUnderline ? "Underline" : ""}`}
                  placeholder="Enter your note..."
                  onChange={onNoteDataChange}
                  value={notesData}
                  style={{ backgroundColor: choosenColor }}
                ></textarea>
                <div className={`note-buttons`}>
                  <div className={`decoration-txt`}>
                    <button
                      onClick={onClickBold}
                      onDoubleClick={onBoldDoubleClick}
                      className={`Bold-btn ${isMode}`}
                    >
                      B
                    </button>
                    <button
                      onClick={onClickItalic}
                      onDoubleClick={onItalicDoubleClick}
                      className={`Italic-btn ${isMode}`}
                    >
                      I
                    </button>
                    <button
                      onClick={onClickUnderline}
                      onDoubleClick={onUnderlineDoubleClick}
                      className={`Underline-btn ${isMode}`}
                    >
                      U
                    </button>
                  </div>

                  <div className="act-btn">
                    <button className="save-btn" onClick={onSaveNote}>
                      Save
                    </button>
                    {/* <button className="back-btn" onClick={() => setShowNotePad(false)}>Back</button> */}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="notes-container">
            {pinnedList
              .filter((el) =>
                el.text.toLowerCase().includes(searchNoteData.toLowerCase())
              )
              .map((element, index) => (
                <div
                  className="note-card"
                  key={index}
                  style={{ backgroundColor: element.color }}
                >
                  <div className="pin-btn">
                    <img
                      src={element.isPinned ? pin : unpin}
                      onClick={() => onPinNotes(index)}
                      onDoubleClick={() => onUnPinNotes(index)}
                    />
                    {/* <button onClick={()=>onPinNotes(index)}>{element.isPinned ? 'UNPIN' : 'PIN'}</button> */}
                  </div>
                  <textarea
                    value={element.text}
                    className={`${element.bold ? "setBold" : ""} 
                    ${element.italic ? "setItalic" : ""} 
                    ${element.underline ? "Underline" : ""}`}
                    readOnly
                  />

                  <div className="note-actions">
                    {/* <button onClick={() => onEditList(index)}>Edit</button>
                                <button onClick={() => onDeleteList(index)}></button> */}
                    <img
                      src={Edit}
                      onClick={() => onEditList(element._id, index)}
                      alt=""
                    />

                    <img
                      src={Del}
                      onClick={() => onDeleteList(null, index)}
                      alt=""
                    />
                  </div>
                </div>
              ))}
            {getNotesList()
              .filter((el) =>
                el.text.toLowerCase().includes(searchNoteData.toLowerCase())
              )
              .map((element, index) => (
                <div
                  className="note-card"
                  key={index}
                  style={{ backgroundColor: element.color }}
                >
                  <div className="pin-btn">
                    <img
                      src={element.isPinned ? pin : unpin}
                      onClick={() => onPinNotes(index)}
                      onDoubleClick={() => onUnPinNotes(index)}
                    />
                    {/* <button onClick={()=>onPinNotes(index)}>{element.isPinned ? 'UNPIN' : 'PIN'}</button> */}
                  </div>
                  <textarea
                    value={element.text}
                    className={`${element.bold ? "setBold" : ""} 
                    ${element.italic ? "setItalic" : ""} 
                    ${element.underline ? "Underline" : ""}`}
                    readOnly
                  />

                  <div className="note-actions">
                    {/* <button onClick={() => onEditList(index)}>Edit</button>
                                <button onClick={() => onDeleteList(index)}></button> */}
                    <img
                      src={Edit}
                      onClick={() => onEditList(element._id, index)}
                      alt=""
                    />

                    <img
                      src={Del}
                      onClick={() => onDeleteList(element._id)}
                      alt=""
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="deleted-note-section">
          {showDeletedNotes && (
            <>
              <div className="deleted-notes">
                {/* <div className="heading">
                        <h4>Deleted Notes</h4>
                    </div> */}
                <div className="delll">
                  <h4>Deleted Notes</h4>
                </div>
                <div className="delete-list">
                  {deletedNote.map((element, index) => {
                    return (
                      <>
                        <div className="del" key={index}>
                          <textarea
                            value={element.text}
                            style={{ backgroundColor: element.color }}
                            className={`${element.bold ? "setBold" : ""} 
                    ${element.italic ? "setItalic" : ""} 
                    ${element.underline ? "Underline" : ""}`}
                          />
                          <div className="del-btn">
                            <img src={Del} alt="" onClick={onDeleteForever} />
                          </div>

                          {delforever && (
                            <div className="modal-overlay">
                              <div
                                className="modal-box"
                                style={{ backgroundColor: element.color }}
                              >
                                <div className="modal-message">
                                  Are you sure you want to delete notes?
                                </div>
                                <div className="modal-buttons">
                                  <button onClick={onNoDelClick}>No</button>
                                  <button
                                    onClick={() => onDelNoteForever(index)}
                                  >
                                    Yes
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>{" "}
            </>
          )}{" "}
        </div>

        <div className="no-notes-section">
          {noDelNotes && (
            <p>You have zero notes... create one to get started</p>
          )}
        </div>
      </div>
      <div className="cl">{getNotesList}</div>
    </div>
  );
}
