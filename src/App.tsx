import React from "react";
import styles from "./App.module.scss";
import BridgeContainer from "./container/BridgeContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Header from "./components/Header";


const App: React.FC = () => {
  return (
    <div className={styles.App}>
      <Header />

      <section className={styles.HeaderContainer} >
        <div style={{ "display": "flex" }}>
          <a href="https://enedex.org/" target={"_blank"} style={{"marginBottom":"auto","marginTop":"auto"}}>
            <FontAwesomeIcon
              className={styles.SwapIcon}
              icon={faArrowLeft}
              size="3x"
              style={{
                color: "white",
                width: "20px",
                cursor: "pointer"
              }}
            />
          </a>
          <h3>
            ENEDEX Bridge
          </h3>
        </div>
        <BridgeContainer />
      </section>
    </div>
  );
};

export default App;
