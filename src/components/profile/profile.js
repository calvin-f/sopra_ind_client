import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import Player from "../../views/Player";
import { Spinner } from "../../views/design/Spinner";
import { Button } from "../../views/design/Button";
import { withRouter } from "react-router-dom";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const UserElement = styled.div`
  margin: 6px 0;
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;


class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null
        };
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        fetch(`${getDomain()}/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(returnedUser => {
                this.setState({
                    user: returnedUser
                });
                console.log(this.state.user);
            })
            .catch(err => {
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                } else {
                    alert(`Something went wrong during the login: ${err.message}`);
                }
            });
    }

    render() {
        function formatDate(date) {
            const fullDate = new Date(date);
            const dd = fullDate.getDate();
            const MM = fullDate.getMonth()+1;
            const yyyy = fullDate.getFullYear();
            return yyyy + '-' + MM + '-' + dd;
        }

        return (
            <Container>
                {!this.state.user ? (
                    <Spinner/>
                ) : (
                <div>
                    <h2>User profile of {this.state.user.name}, {this.state.user.status}</h2>
                    <p>Get all users from secure end point:</p>

                    <div>
                        <UserElement>Username: {this.state.user.username}</UserElement>
                        <UserElement>Birthday: {formatDate(this.state.user.birthday)}</UserElement>
                        <UserElement>Creation Date: {formatDate(this.state.user.creationDate)}</UserElement>

                        <Button
                            disabled={!(this.state.user.token === localStorage.token)}
                            width="50%"
                            onClick={() => {
                                this.edit();
                            }}
                        >
                            Edit
                        </Button>
                    </div>
                </div>
                )}
            </Container>
        );
    }

    edit() {
        const id = this.props.match.params.id;
        this.props.history.push(`/user/${id}/edit`)
    }
}

export default withRouter(Profile);