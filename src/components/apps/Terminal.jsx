import React, { useState, useRef, useEffect } from "react";
import { fileSystem } from "../../data/resumeData";
import emailjs from "@emailjs/browser";

const NEOFETCH_HTML = `
<pre style="color: #60a5fa; line-height: 1.1; font-family: 'Courier New', Courier, monospace; font-size: 11px; margin: 8px 0; text-shadow: 0 0 10px rgba(96,165,250,0.4);">
 ____        _        _     
|  _ \\  __ _| | _____| |__  
| | | |/ _\` | |/ / __| '_ \\ 
| |_| | (_| |   <\\__ \\ | | |
|____/ \\__,_|_|\\_\\___/_| |_|
<span style="color: #94a3b8;">Full-Stack Developer  |  Competitive Programmer</span>
</pre>
`;

const AITypewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 20);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return <span style={{ color: "#e9d5ff" }}>{displayedText}</span>;
};

export default function Terminal() {
  const [history, setHistory] = useState([
    { type: "output", text: NEOFETCH_HTML, isHtml: true },
    { type: "output", text: "Welcome to DakshOS Terminal v1.0.0" },
    { type: "output", text: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [contactMode, setContactMode] = useState(false);
  const [contactStep, setContactStep] = useState(0); // 0: name, 1: email, 2: subject, 3: message, 4: ready
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transProgress, setTransProgress] = useState(0);


  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [history, input, contactMode, contactStep, isTransmitting]);

  const sendEmail = () => {
    setIsTransmitting(true);
    setTransProgress(0);

    // Simulate transmission animation
    const interval = setInterval(() => {
      setTransProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // EmailJS call matching the template: {{subject}}, {{name}}, {{email}}, {{message}}, {{time}}
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject,
          message: contactData.message,
          time: new Date().toLocaleString(),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        setTimeout(() => {
          setIsTransmitting(false);
          setContactMode(false);
          setHistory((prev) => [
            ...prev,
            {
              type: "output",
              text: `<div style="color: #10b981; font-weight: bold; margin: 10px 0;">[ SUCCESS ] Message transmitted successfully via encrypted channel.</div>`,
              isHtml: true,
            },
          ]);
          setContactData({ name: "", email: "", subject: "", message: "" });
          setContactStep(0);
        }, 1500);
      })
      .catch(() => {
        setTimeout(() => {
          setIsTransmitting(false);
          setContactMode(false);
          setHistory((prev) => [
            ...prev,
            {
              type: "output",
              text: `<div style="color: #ef4444; font-weight: bold; margin: 10px 0;">[ ERROR ] Transmission failed. Check credentials in .env file.</div>`,
              isHtml: true,
            },
          ]);
          setContactStep(0);
        }, 1500);
      });
  };

  const handleContactInput = (e) => {
    if (e.key === "Enter") {
      const val = input.trim();
      if (!val && contactStep < 3) return;

      const newHistory = [
        ...history,
        { type: "output", text: `${getContactPrompt(contactStep)} ${val}` },
      ];
      setHistory(newHistory);
      setInput("");

      if (contactStep === 0) {
        setContactData({ ...contactData, name: val });
        setContactStep(1);
      } else if (contactStep === 1) {
        setContactData({ ...contactData, email: val });
        setContactStep(2);
      } else if (contactStep === 2) {
        setContactData({ ...contactData, subject: val });
        setContactStep(3);
      } else if (contactStep === 3) {
        setContactData({ ...contactData, message: val });
        setContactStep(4);
      }
    }
  };

  const getContactPrompt = (step) => {
    if (step === 0) return "[ CONTACT ] Enter your Name:";
    if (step === 1) return "[ CONTACT ] Enter your Email:";
    if (step === 2) return "[ CONTACT ] Enter Subject:";
    if (step === 3) return "[ CONTACT ] Enter your Message:";
    return "";
  };

  const COMMANDS = [
    "help", "clear", "ls", "cat", "whoami", "neofetch", "contact",
    "ask", "social", "open", "date", "weather", "echo", "history", "sudo",
  ];

  const OPEN_TARGETS = ["github", "linkedin", "email", "whatif", "dvacapstone", "finshield", "houseprice", "hrattrition", "netflixdata", "tripwallet", "poker", "dvaportfolio"];

  const handleCommand = (e) => {
    if (contactMode) {
      handleContactInput(e);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.split(" ");
      const mainCmd = parts[0]?.toLowerCase();

      // If typing the first word → autocomplete commands
      if (parts.length <= 1) {
        const prefix = input.toLowerCase();
        const matches = COMMANDS.filter((c) => c.startsWith(prefix));
        if (matches.length === 1) {
          setInput(matches[0]);
        } else if (matches.length > 1) {
          // Find longest common prefix among matches
          let common = matches[0];
          for (const m of matches) {
            while (!m.startsWith(common)) {
              common = common.slice(0, -1);
            }
          }
          if (common.length > prefix.length) {
            setInput(common);
          }
          setHistory((prev) => [
            ...prev,
            { type: "input", text: `daksh@portfolio:~$ ${input}` },
            {
              type: "output",
              text: matches
                .map(
                  (c) =>
                    `<span style="color:#8b5cf6;font-weight:bold">${c}</span>`,
                )
                .join("  "),
              isHtml: true,
            },
          ]);
        }
        return;
      }

      // If typing a second argument → autocomplete based on command
      const argPrefix = parts.slice(1).join(" ").toLowerCase();

      if (mainCmd === "cat") {
        const fileNames = Object.keys(fileSystem);
        const matches = fileNames.filter((f) =>
          f.toLowerCase().startsWith(argPrefix),
        );
        if (matches.length === 1) {
          setInput(`${mainCmd} ${matches[0]}`);
        } else if (matches.length > 1) {
          let common = matches[0];
          for (const m of matches) {
            while (!m.startsWith(common)) {
              common = common.slice(0, -1);
            }
          }
          if (common.length > argPrefix.length) {
            setInput(`${mainCmd} ${common}`);
          }
          setHistory((prev) => [
            ...prev,
            { type: "input", text: `daksh@portfolio:~$ ${input}` },
            {
              type: "output",
              text: matches
                .map(
                  (f) =>
                    `<span style="color:#8b5cf6;font-weight:bold">${f}</span>`,
                )
                .join("  "),
              isHtml: true,
            },
          ]);
        }
        return;
      }

      if (mainCmd === "open") {
        const matches = OPEN_TARGETS.filter((t) =>
          t.startsWith(argPrefix),
        );
        if (matches.length === 1) {
          setInput(`${mainCmd} ${matches[0]}`);
        } else if (matches.length > 1) {
          let common = matches[0];
          for (const m of matches) {
            while (!m.startsWith(common)) {
              common = common.slice(0, -1);
            }
          }
          if (common.length > argPrefix.length) {
            setInput(`${mainCmd} ${common}`);
          }
          setHistory((prev) => [
            ...prev,
            { type: "input", text: `daksh@portfolio:~$ ${input}` },
            {
              type: "output",
              text: matches
                .map(
                  (t) =>
                    `<span style="color:#8b5cf6;font-weight:bold">${t}</span>`,
                )
                .join("  "),
              isHtml: true,
            },
          ]);
        }
        return;
      }


      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIndex = historyIndex - 1;
        setHistoryIndex(prevIndex);
        setInput(commandHistory[commandHistory.length - 1 - prevIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Enter") {
      const cmd = input.trim();
      setInput("");
      setHistoryIndex(-1);

      const newHistory = [
        ...history,
        { type: "input", text: `daksh@portfolio:~$ ${cmd}` },
      ];

      if (!cmd) {
        setHistory(newHistory);
        return;
      }

      const newCmdHistory = [...commandHistory, cmd];
      setCommandHistory(newCmdHistory);

      const args = cmd.split(" ");
      const mainCmd = args[0].toLowerCase();

      let output = "";
      let isHtml = false;

      switch (mainCmd) {
        case "help":
          output = `Available commands:
  <span style="color:#3b82f6;font-weight:bold">help</span>      - Show this message
  <span style="color:#3b82f6;font-weight:bold">clear</span>     - Clear terminal
  <span style="color:#3b82f6;font-weight:bold">ls</span>        - List files
  <span style="color:#3b82f6;font-weight:bold">cat</span>       - Read a file (e.g., cat about.txt)
  <span style="color:#3b82f6;font-weight:bold">whoami</span>    - Print current user
  <span style="color:#3b82f6;font-weight:bold">neofetch</span>  - Show system information
  <span style="color:#3b82f6;font-weight:bold">contact</span>   - Send me a message
  <span style="color:#3b82f6;font-weight:bold">ask</span>       - Ask the AI Assistant
  <span style="color:#3b82f6;font-weight:bold">social</span>    - Show social links
  <span style="color:#3b82f6;font-weight:bold">open</span>      - Open a URL (e.g., open github)
  <span style="color:#3b82f6;font-weight:bold">date</span>      - Show current date/time
  <span style="color:#3b82f6;font-weight:bold">weather</span>   - Show current weather
  <span style="color:#3b82f6;font-weight:bold">echo</span>      - Print arguments
  <span style="color:#3b82f6;font-weight:bold">history</span>   - Show command history`;
          isHtml = true;
          break;
        case "clear":
          setHistory([]);
          return;
        case "ls":
          output = Object.keys(fileSystem)
            .map(
              (f) => `<span style="color:#8b5cf6;font-weight:bold">${f}</span>`,
            )
            .join("  ");
          isHtml = true;
          break;
        case "cat":
          if (args.length < 2) {
            output =
              'cat: missing file operand\nTry "ls" to see available files.';
          } else {
            const fileName = args[1];
            if (fileSystem[fileName]) {
              output = fileSystem[fileName];
            } else {
              output = `cat: ${fileName}: No such file or directory`;
            }
          }
          break;
        case "whoami":
          output = "daksh_batra\n(Full-Stack Developer)";
          break;
        case "sudo":
          output =
            '<span style="color:#ef4444">Daksh is not in the sudoers file. This incident will be reported.</span>';
          isHtml = true;
          break;
        case "neofetch": {
          const bar = (pct, color) => {
            const filled = Math.round(pct / 5);
            const empty = 20 - filled;
            return `<span style="color:${color}">` + '█'.repeat(filled) + `</span><span style="color:#334155">` + '░'.repeat(empty) + `</span> <span style="color:#94a3b8">${pct}%</span>`;
          };
          output = `${NEOFETCH_HTML}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 24px;margin:8px 0;padding:10px;background:rgba(0,0,0,0.3);border-radius:8px;border:1px solid rgba(255,255,255,0.06)">
  <div><span style="color:#10b981;font-weight:bold">OS</span>        <span style="color:#94a3b8">DakshOS v1.0</span></div>
  <div><span style="color:#10b981;font-weight:bold">Shell</span>     <span style="color:#94a3b8">dakshsh</span></div>
  <div><span style="color:#10b981;font-weight:bold">Uptime</span>    <span style="color:#94a3b8">${Math.floor(performance.now() / 60000)}m</span></div>
  <div><span style="color:#10b981;font-weight:bold">Theme</span>     <span style="color:#94a3b8">Default</span></div>
  <div><span style="color:#10b981;font-weight:bold">Terminal</span>  <span style="color:#94a3b8">portfolio-term</span></div>
  <div><span style="color:#10b981;font-weight:bold">Role</span>      <span style="color:#94a3b8">Full-Stack Dev</span></div>
</div>
<div style="margin:6px 0;padding:10px;background:rgba(0,0,0,0.3);border-radius:8px;border:1px solid rgba(255,255,255,0.06)">
  <div style="color:#3b82f6;font-weight:bold;margin-bottom:6px">⚡ Skills</div>
  <div style="font-size:12px"><span style="color:#f8fafc">React     </span> ${bar(92, '#61dafb')}</div>
  <div style="font-size:12px"><span style="color:#f8fafc">Node.js   </span> ${bar(88, '#68a063')}</div>
  <div style="font-size:12px"><span style="color:#f8fafc">C++       </span> ${bar(85, '#00599c')}</div>
  <div style="font-size:12px"><span style="color:#f8fafc">Python    </span> ${bar(80, '#ffd43b')}</div>
  <div style="font-size:12px"><span style="color:#f8fafc">AI/ML     </span> ${bar(75, '#a78bfa')}</div>
</div>
<div style="margin:6px 0;display:flex;gap:4px">${['#ef4444','#f59e0b','#22c55e','#3b82f6','#8b5cf6','#ec4899','#06b6d4','#f8fafc'].map(c => `<span style="background:${c};width:28px;height:12px;display:inline-block;border-radius:2px"></span>`).join('')}</div>`;
          isHtml = true;
          break;
        }
        case "contact":
          setContactMode(true);
          setContactStep(0);
          setHistory([
            ...newHistory,
            {
              type: "output",
              text: '<div style="color: #10b981; font-weight: bold;">[ INIT ] Starting Secure Communication Protocol...</div>',
              isHtml: true,
            },
          ]);
          return;
        case "ask":
          const question = args.slice(1).join(" ").toLowerCase();
          if (!question) {
            output =
              'Usage: ask <your question>\nExample: ask "What are your skills?"';
          } else {
            let aiAnswer = "";
            if (question.includes("project")) {
              aiAnswer =
                "Daksh has built Videxa (video AI search/chat), MentorConnect (mentor platform), What-If Engine (IPL simulation), SentiVox (sentiment analysis), Poker, DVA Capstone G2, FinShield, House Price Predictor, HR Attrition Analysis, Netflix Data Analysis, TripWallet Re-Design, and DVA Portfolio.";
            } else if (
              question.includes("skill") ||
              question.includes("tech")
            ) {
              aiAnswer =
                "Daksh specializes in React, Next.js, Node.js, Express, FastAPI, Python, MongoDB, TypeScript, FAISS, Flutter, Dart, OpenCV, PyTorch, TensorFlow, Gemini AI, and WebSockets.";
            } else if (
              question.includes("achievement") ||
              question.includes("award")
            ) {
              aiAnswer =
                "Daksh has secured top 10 in Microsoft Azure InnoQuest AccessHack, 6th Rank in NIT Kurukshetra CODEMATHON 2024, and 14th Rank in NST Junior Coding Olympiad.";
            } else if (
              question.includes("experience") ||
              question.includes("work")
            ) {
              aiAnswer =
                "Daksh focuses on full-stack AI applications and data science. Check out his achievements and education details in the terminal!";
            } else if (
              question.includes("who") ||
              question.includes("daksh")
            ) {
              aiAnswer =
                "Daksh Batra is a high-performance Full-Stack Developer. He loves building AI-powered tools and scalable web applications.";
            } else {
              aiAnswer =
                "I'm Daksh's assistant. Ask me about his projects, skills, or achievements!";
            }
            setHistory([...newHistory, { type: "ai-output", text: aiAnswer }]);
            return;
          }
          break;
        case "social":
          output = `<div style="margin:4px 0">
  <div style="color:#10b981;font-weight:bold;margin-bottom:8px">🔗 Social & Contact</div>
  <div><span style="color:#60a5fa">▸</span> GitHub   → <span style="color:#94a3b8">github.com/dakshbatra01</span></div>
  <div><span style="color:#a78bfa">▸</span> LinkedIn → <span style="color:#94a3b8">linkedin.com/in/daksh-batra-124814317</span></div>
  <div><span style="color:#f472b6">▸</span> Email    → <span style="color:#94a3b8">dakshbatra2007@gmail.com</span></div>
  <div style="color:#64748b;margin-top:8px;font-size:12px">Type "open github", "open linkedin", or "open email"</div>
</div>`;
          isHtml = true;
          break;
        case "open":
          const target = args[1]?.toLowerCase();
          const urls = {
            github: "https://github.com/dakshbatra01",
            linkedin: "https://www.linkedin.com/in/daksh-batra-124814317/",
            email: "mailto:dakshbatra2007@gmail.com",
            whatif: "https://github.com/dakshbatra01/What-If",
            dvacapstone: "https://github.com/dakshbatra01/DVA_Capstone_G2",
            finshield: "https://github.com/dakshbatra01/SectionD_G1_FinShield",
            houseprice: "https://github.com/shourya2006/HousePricePredictor",
            hrattrition: "https://github.com/dakshbatra01/HR_Attrition_Analysis",
            netflixdata: "https://github.com/dakshbatra01/Netflix_Data_Analysis",
            tripwallet: "https://github.com/shourya2006/TripWallet-ReDesign",
            poker: "https://github.com/dakshbatra01/Poker",
            dvaportfolio: "https://github.com/dakshbatra01/DVA_Portfolio",
          };
          if (!target) {
            output =
              "Usage: open <site>\nAvailable: github, linkedin, email, whatif, dvacapstone, finshield, houseprice, hrattrition, netflixdata, tripwallet, poker, dvaportfolio";
          } else if (urls[target]) {
            window.open(urls[target], "_blank");
            output = `Opening ${target}...`;
          } else {
            output = `Unknown site: ${target}\nAvailable: github, linkedin, email, whatif, dvacapstone, finshield, houseprice, hrattrition, netflixdata, tripwallet, poker, dvaportfolio`;
          }
          break;
        case "date":
          output = new Date().toString();
          break;
        case "weather":
          output = "Fetching weather...\n🌤️ Sunny, 24°C / 75°F\nWind: 12 km/h";
          break;
        case "echo":
          output = args.slice(1).join(" ");
          break;
        case "history":
          output = newCmdHistory.map((c, i) => `  ${i + 1}  ${c}`).join("\n");
          break;
        default:
          output = `<span style="color:#ef4444">Command not found: ${mainCmd}</span>\nType "help" for available commands.`;
          isHtml = true;
      }

      setHistory([...newHistory, { type: "output", text: output, isHtml }]);
    }
  };


  return (
    <div
      className="selectable"
      style={{
        backgroundColor: "var(--terminal-bg)",
        color: "#cbd5e1",
        fontFamily: "var(--font-mono)",
        fontSize: "14px",
        padding: "16px",
        height: "100%",
        overflowY: "auto",
        textShadow: "0 0 2px rgba(255,255,255,0.3)",
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
        position: "relative",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} style={{ marginBottom: "4px", whiteSpace: "pre-wrap" }}>
          {line.type === "input" ? (
            <span>
              <span style={{ color: "#10b981", fontWeight: "bold" }}>
                daksh
              </span>
              <span style={{ color: "#94a3b8" }}>@</span>
              <span style={{ color: "#3b82f6", fontWeight: "bold" }}>
                portfolio
              </span>
              <span style={{ color: "#cbd5e1" }}>:~$ </span>
              <span style={{ color: "#f8fafc" }}>
                {line.text.replace("daksh@portfolio:~$ ", "")}
              </span>
            </span>
          ) : line.type === "ai-output" ? (
            <div style={{ display: "flex", gap: "10px", margin: "5px 0" }}>
              <div
                style={{
                  color: "#a78bfa",
                  fontWeight: "bold",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                [ AI ]:
              </div>
              <AITypewriter text={line.text} />
            </div>
          ) : line.isHtml ? (
            <span dangerouslySetInnerHTML={{ __html: line.text }} />
          ) : (
            <span>{line.text}</span>
          )}
        </div>
      ))}

      {/* Contact Mode Interface */}
      {contactMode && !isTransmitting && (
        <div style={{ marginTop: "10px" }}>
          {contactStep < 4 ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: "#10b981", marginRight: "10px" }}>
                {getContactPrompt(contactStep)}
              </span>
              <span style={{ color: "#f8fafc", whiteSpace: "pre" }}>
                {input}
              </span>
              <span className="cursor" />
            </div>
          ) : (
            <div
              style={{
                background: "rgba(16,185,129,0.1)",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid rgba(16,185,129,0.3)",
                margin: "15px 0",
              }}
            >
              <div
                style={{
                  color: "#10b981",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                [ READY ] Verify Details:
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  marginBottom: "4px",
                }}
              >
                Name:{" "}
                <span style={{ color: "#f1f5f9" }}>{contactData.name}</span>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  marginBottom: "4px",
                }}
              >
                Email:{" "}
                <span style={{ color: "#f1f5f9" }}>{contactData.email}</span>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  marginBottom: "4px",
                }}
              >
                Subject:{" "}
                <span style={{ color: "#f1f5f9" }}>{contactData.subject}</span>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  marginBottom: "12px",
                }}
              >
                Message:{" "}
                <span style={{ color: "#f1f5f9" }}>{contactData.message}</span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={sendEmail}
                  style={{
                    background: "#10b981",
                    border: "none",
                    color: "#000",
                    padding: "6px 16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  SEND MESSAGE
                </button>
                <button
                  onClick={() => {
                    setContactMode(false);
                    setContactStep(0);
                  }}
                  style={{
                    background: "transparent",
                    border: "1px solid #475569",
                    color: "#94a3b8",
                    padding: "6px 16px",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transmission Animation */}
      {isTransmitting && (
        <div
          style={{
            margin: "20px 0",
            padding: "15px",
            background: "rgba(0,0,0,0.4)",
            borderRadius: "8px",
            border: "1px dashed #10b981",
          }}
        >
          <div
            style={{
              color: "#10b981",
              fontWeight: "bold",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>TRANSMITTING ENCRYPTED PACKETS...</span>
            <span>{Math.floor(transProgress)}%</span>
          </div>
          <div
            style={{
              height: "10px",
              width: "100%",
              background: "#0f172a",
              borderRadius: "5px",
              overflow: "hidden",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${transProgress}%`,
                background: "#10b981",
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#64748b",
              fontFamily: "monospace",
              overflow: "hidden",
              height: "1.2em",
            }}
          >
            {Array.from({ length: 20 })
              .map(() => Math.random().toString(16).slice(2, 8))
              .join(" ")}
          </div>
        </div>
      )}

      {/* Normal Prompt */}
      {!contactMode && !isTransmitting && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <span
            style={{
              color: "#10b981",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            daksh
          </span>
          <span style={{ color: "#94a3b8", whiteSpace: "nowrap" }}>@</span>
          <span
            style={{
              color: "#3b82f6",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            portfolio
          </span>
          <span
            style={{
              color: "#cbd5e1",
              marginRight: "8px",
              whiteSpace: "nowrap",
            }}
          >
            :~$
          </span>
          <span style={{ color: "#f8fafc", whiteSpace: "pre" }}>{input}</span>
          <span className="cursor" />
        </div>
      )}

      <div ref={endRef} style={{ height: "20px" }} />

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleCommand}
        style={{
          position: "absolute",
          opacity: 0,
          width: "1px",
          height: "1px",
          bottom: 0,
          left: 0,
          pointerEvents: "none",
        }}
        autoFocus
        spellCheck="false"
        autoComplete="off"
      />

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor {
          display: inline-block;
          width: 8px;
          height: 16px;
          background-color: #f8fafc;
          animation: blink 1s step-end infinite;
          margin-left: 1px;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}
