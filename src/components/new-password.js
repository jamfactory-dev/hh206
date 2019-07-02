import React from "react"
import { navigate } from "gatsby"
import { handleNewPassword, isLoggedIn } from "../services/auth"

class NewPassword extends React.Component {
    state = {
        password: ``,
        confirmPassword: ``,
    }

    handleUpdate = event => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    handleSubmit = event => {
        event.preventDefault();
        handleNewPassword(this.state.password, {
            onSuccess: function () {
                navigate(`/app/profile`)
            },
        });
    }

    render() {
        if (isLoggedIn()) {
            navigate(`/app/profile`);
        }

        return (
            <>
                <h1>You need to change your password</h1>
                <form
                    method="post"
                    onSubmit={event => {
                        this.handleSubmit(event)
                        navigate(`/app/profile`)
                    }}
                >
                    <label>
                        Password
                        <input type="password" name="password" onChange={this.handleUpdate} />
                    </label>
                    <label>
                        Confirm Password
                        <input
                            type="password"
                            name="confirmPassword"
                            onChange={this.handleUpdate}
                        />
                    </label>
                    <input type="submit" value="Change Password" disabled={this.state.password !== this.state.confirmPassword} />
                </form>
            </>
        )
    }
}

export default NewPassword