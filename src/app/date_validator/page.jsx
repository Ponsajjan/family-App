'use client'

import React, { useState } from "react";
import validator from "validator";

const date_validator = () => {
    const [errorMessage, setErrorMessage] = useState("");

    const validateDate = (value) => {
        // Check if the input has at least 10 characters (e.g., "YYYY-MM-DD")
        if (value.length === 10) {
            // Validate date using validator's isDate function
            if (
                validator.isDate(value, {
                    format: "DD-MM",
                    strictMode: true
                })
            ) {
                setErrorMessage("Valid Date :)");
            } else {
                setErrorMessage("Enter Valid Date! Use format YYYY-MM-DD.");
            }
        } else {
            setErrorMessage("Enter Valid Date! Use format YYYY-MM-DD.");
        }
    };

    return (
        <div style={{ marginLeft: "200px" }}>
            <h2>Validating Date in ReactJS</h2>
            <div>
                <span>Enter Date (YYYY-MM-DD): </span>
                <input
                    type="text"
                    onChange={(e) => validateDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                />
            </div>
            <br />
            <span style={{ fontWeight: "bold", color: "red" }}>
                {errorMessage}
            </span>
        </div>
    );
};

export default date_validator;