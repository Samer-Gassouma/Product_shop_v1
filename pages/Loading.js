import React from "react";
import styles from "@/styles/Loading.module.css";
const Loader = () => (
    <div className="flex items-center justify-center h-screen">
      <div className={styles.loader}>
        <div className={styles["loader-inner"]}>
          {[...Array(24)].map((_, index) => (
            <div key={index} className={styles["loader-block"]}></div>
          ))}
        </div>
      </div>
    </div>
);

export default Loader;
