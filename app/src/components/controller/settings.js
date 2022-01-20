import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"

const Settings = (props) => {

    const closeBtn = <button className="close" onClick={props.actions.updateCategory("view", {settings: false})}><i className="bi bi-x-lg" style={{ color: "#ce0e0e" }}></i></button>;

    return (
        <div>
            <Modal
                isOpen={props.view.settings ? true : false}
                toggle={function noRefCheck() { }}
            >
                <ModalHeader
                    close={closeBtn}
                    toggle={function noRefCheck() { }}>
                    Modal title
                </ModalHeader>
                <ModalBody>
                    Modal body
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={function noRefCheck() { }}
                    >
                        Do Something
                    </Button>
                    {' '}
                    <Button onClick={function noRefCheck() { }}>
                        Cancel
      </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Settings;