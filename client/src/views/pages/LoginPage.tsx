import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { User } from "src/models/User";
import { getCurrentUser } from "src/state/ducks/data/users/selectors";
import { CreateNewUserCreator, LoginCreator } from "../../state/ducks/data/users";
import { RootState } from "../../state/rootReducer";
import LoginContent from "../content/LoginContent";

interface PropsFromState {
    currentUser?: User;
}

interface PropsFromDispatch {
    createNewUser: typeof CreateNewUserCreator;
    login: typeof LoginCreator;
}

type Props = PropsFromDispatch & PropsFromState;

class LoginPage extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <LoginContent
                {...this.props}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    currentUser: getCurrentUser(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => {
    return bindActionCreators({
        createNewUser: CreateNewUserCreator,
        login: LoginCreator,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
