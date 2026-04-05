import { useEffect } from "react";
import Icon, { Icons } from "./Icon";

// Shows a small popup notification at the bottom-right
// Props:
//   msg   - message to display
//   type  - "success" | "error"
//   onClose - called after 3 seconds to hide it

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {type === "success"
        ? <Icon d={Icons.check} size={16} />
        : <Icon d={Icons.x} size={16} />}
      {msg}
    </div>
  );
}

export default Toast;