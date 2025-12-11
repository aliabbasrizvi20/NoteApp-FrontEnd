import { useEffect, useState } from "react";
import "./ToDo.css";
import profile from "../ToDo/Assets/profile.png";
import Add from "../ToDo/Assets/plus.png";
import SearchIcon from "../ToDo/Assets/search-interface-symbol.png";
import CloseIcon from "../ToDo/Assets/close-circle-svgrepo-com.svg";
import Edit from "../ToDo/Assets/pen.png";
import Del from "../ToDo/Assets/delete-svgrepo-com.svg";
import { Link } from "react-router-dom";
import pin from "../ToDo/Assets/pin (1).png";
import unpin from "../ToDo/Assets/pin.png";
import lightMode from "../ToDo/Assets/day-mode.png";
import nightMode from "../ToDo/Assets/moon-and-stars.png";
import axiosClient from "../../api/axiosClient";

export default function ToDoApp() {
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
  const [isMode, setIsMode] = useState("");
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
  }, [itemlist, user]);

  const getNotes = async () => {
    const notes = await axiosClient.get("/note");
    setItemList(notes.data.notes);
  };
  const deleteNote = async (id) => {
    await axiosClient.delete(`note/${id}`);
    getNotes();
  };
  const onAddNote = async (body) => {
    await axiosClient.post("/note", body);
    getNotes();
  };

  useEffect(() => {
    if (user) {
      getNotes();
    }
  }, [user]);

  const onAddList = () => {
    setNoteColors(true);
    setNotesData("");
    setChoosenColor("");
    setEditIndex(null);
    setEditId(null);
  };

  const onDeleteList = (id, index) => {
    if (user && id) {
      deleteNote(id);
    } else {
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

    const newNote = {
      text: notesData,
      color: choosenColor,
      bold: textBold,
      italic: textItalic,
      underline: textUnderline,
      isPinned: false,
    };

    if (user) {
      if (editId !== null) {
        callEditApi(editId);
      } else {
        onAddNote(newNote);
      }
    } else {
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
    const pinnedList = itemlist?.filter((item) => item.isPinned);
    const nonPinnedList = itemlist?.filter((item) => !item.isPinned);
    return [...pinnedList, ...nonPinnedList];
  };

  const onEditList = async (id, index) => {
    setChoosenColor(itemlist[index].color);
    setNotesData(itemlist[index].text);
    setTextBold(itemlist[index].bold || false);
    setTextItalic(itemlist[index].italic || false);
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
  };
  const onUnPinNotes = (index) => {
    console.log(index);
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
      <div className={`container ${isMode}`}>
        <div
          className={`nav-container ${navUnderline}`}
          style={{ backgroundColor: isMode ? "black" : "whitesmoke" }}
        >
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
            <div
              className="dropdown-content"
              style={{ backgroundColor: isMode ? "black" : "white" }}
            >
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
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="notes-container">
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
                      alt="PinnedNote"
                      onClick={() => onPinNotes(index)}
                      onDoubleClick={() => onUnPinNotes(index)}
                    />
                  </div>
                  <textarea
                    value={element.text}
                    className={`${element.bold ? "setBold" : ""} 
                    ${element.italic ? "setItalic" : ""} 
                    ${element.underline ? "Underline" : ""}`}
                    readOnly
                  />

                  <div className="note-actions">
                    <img
                      src={Edit}
                      onClick={() => onEditList(element._id, index)}
                      alt=""
                    />

                    <img
                      src={Del}
                      onClick={() => onDeleteList(element._id, index)}
                      alt="Delete"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
