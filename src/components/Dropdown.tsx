import React from "react";
import styles from "../styles/components/Dropdown.module.scss";
import { binance, avax } from "../assets";

interface SwapContainerProps {
  img: string;
  open: boolean;
  value: "Avalanche C-Chain" | "Binance Smart Chain";
  side: "left" | "right";
  valueChanger: (value: "Avalanche C-Chain" | "Binance Smart Chain", side: "left" | "right") => void;
  // toggleDropdown: (side: "left" | "right") => void;
}

/**
 *
 * @param props img: image of the swapper container to be displayed
 * @param props open: whether the dropdown is open or not
 * @param props value: value of the swapper container
 * @param props side: side of the swapper container (left or right)
 * @param props valueChanger: function to be called when the value of the swapper container is changed
 * @param props toggleDropdown: function to be called when the dropdown is toggled
 *
 * @returns a custom dropdown swapper component configured with the given props
 */

const SwapContainer: React.FC<SwapContainerProps> = (props) => {
  return (
    <div className={styles.SwapContainer}>
      <section
        className={styles.View}
        // onClick={() => props.toggleDropdown(props.side)}
        style={{
          borderBottom: !props.open ? "1px solid #fff" : "",
        }}
      >
        <div>
          <img
            src={props.img}
            alt={props.value}
            style={{
              height: `${props.value === "Binance Smart Chain"}`,
              padding: `${props.value === "Binance Smart Chain" && "-1rem 4px"}`,
            }}
          />
          <p>{props.value}</p>
        </div>
       </section>
      {props.open && (
        <section
          className={styles.Dropdown}
          onClick={() =>
            props.valueChanger(
              props.value === "Binance Smart Chain" ? "Avalanche C-Chain" : "Binance Smart Chain",
              props.side
            )
          }
        >
          <hr />
          <div>
            <img
              src={props.value === "Binance Smart Chain" ? avax : binance}
              alt={props.value}
              style={{
                height: `${props.value === "Binance Smart Chain" }`,
                padding: `${props.value === "Binance Smart Chain" && "0.1rem 2.8px"}`,
              }}
            />
            <p>{props.value === "Binance Smart Chain" ? "Avalanche C-Chain" : "Binance Smart Chain"}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default SwapContainer;
