import { useEffect } from "react";

import Banners from "../Components/Banners/Index";
import CardList from "../Components/CardList/Index";

function Dashboard() {
  useEffect(() => {
    document.title = "Dim - Dashboard";
  }, []);

  return (
    <div className="dashboard">
      <Banners/>
      <CardList path={"/api/v1/dashboard"}/>
    </div>
  );
}

export default Dashboard;
