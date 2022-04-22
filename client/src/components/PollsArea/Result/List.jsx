import React from "react";

const List = ({ item }) => {

    const answers = item.answers.reduce((text, currItem) => text + currItem.variant + "\n", "");

    return (
        <textarea value={answers} readOnly className="result__list">
        </textarea>
    );
};

export default List;