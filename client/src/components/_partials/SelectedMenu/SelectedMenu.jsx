import React from "react";

import "./selectedMenu.scss";

const SelectedMenu = (props) => {

    const { amount, action } = props;

    return (
        <div className="selected-menu">
            <div className="selected-menu__actions">
                <span 
                    className="selected-menu__action" 
                    onClick={() => action("cancel")}
                >
                    cancel
                </span>

                <span 
                    className="selected-menu__action" 
                    onClick={() => action("delete")}
                >
                    delete(not implemented)
                </span>

                <span 
                    className="selected-menu__action" 
                    onClick={() => action("save")}
                >
                    save
                </span>
            </div>

            <span className="selected-menu__amount">{`${amount} selected`}</span>
        </div>
    );
};

export default SelectedMenu;