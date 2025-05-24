import { useEffect, useState } from "react";
import Info from "../components/Info";
import OtherComponent from "../components/OtherComponent"; 

function Dashboard() {
  const [selectedComponent, setSelectedComponent] = useState("info");
  const [componentToRender, setComponentToRender] = useState(<Info />);

  useEffect(() => {
    // Runs whenever selectedComponent changes
    switch (selectedComponent) {
      case "info":
        setComponentToRender(<Info />);
        break;
      case "other":
        setComponentToRender(<OtherComponent />);
        break;
      default:
        setComponentToRender(<Info />);
    }
  }, [selectedComponent]);

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setSelectedComponent("info")}>Show Info</button>
        <button onClick={() => setSelectedComponent("other")}>Show Other</button>
      </div>
      {componentToRender}
    </div>
  );
}

export default Dashboard;
