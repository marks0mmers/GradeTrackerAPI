import { ViewRequest } from "./view-request.model";

export interface ViewRequestManager {
    getAllForReceiver(receiverId: string): Promise<ViewRequest>;
    getAllForRequester(requesterId: string): Promise<ViewRequest>;
    // TODO
}
