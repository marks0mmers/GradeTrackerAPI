import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { ViewRequestException } from "../exceptions/ViewRequestException";
import { ViewRequestRepository } from "./view-requeest.repository";
import { ViewRequest } from "./view-request.model";
import { ViewRequestDTO } from "./view-request.schema";
import { ViewRequestStatus } from "./view-request.statuses";

export interface ViewRequestManager {
    getAllForReceiver(receiverId: string): Promise<ViewRequest[]>;
    getAllForRequester(requesterId: string): Promise<ViewRequest[]>;
    sendUserViewRequest(currentUserId: string, userToRequest: string): Promise<ViewRequest>;
    approveViewRequest(requestId: string, currentUserId: string): Promise<ViewRequest>;
    denyViewRequest(requestId: string, currentUserId: string): Promise<ViewRequest>;
}

@injectable()
export class ViewRequestManagerImpl implements ViewRequestManager {

    @inject(TYPES.ViewRequestRepository)
    private viewRequestRepository: ViewRequestRepository;

    public async getAllForReceiver(receiverId: string): Promise<ViewRequest[]> {
        return await this.viewRequestRepository.findAll()
            .then((requests: ViewRequestDTO[]) => requests.map((r: ViewRequestDTO) => toViewRequest(r)))
            .then((requests: ViewRequest[]) => requests.filter((r: ViewRequest) => r.reciever === receiverId));
    }
    public async  getAllForRequester(requesterId: string): Promise<ViewRequest[]> {
        return await this.viewRequestRepository.findAll()
            .then((requests: ViewRequestDTO[]) => requests.map((r: ViewRequestDTO) => toViewRequest(r)))
            .then((requests: ViewRequest[]) => requests.filter((r: ViewRequest) => r.requester === requesterId));
    }
    public async sendUserViewRequest(currentUserId: string, userToRequest: string): Promise<ViewRequest> {
        const newRequest: ViewRequestDTO = {
            requester: currentUserId,
            reciever: userToRequest,
            status: ViewRequestStatus.SENT
        };

        return await this.viewRequestRepository.create(newRequest)
            .then((request: ViewRequestDTO) => toViewRequest(request));
    }
    public async approveViewRequest(requestId: string, currentUserId: string): Promise<ViewRequest> {
        const requestToApprove = await this.viewRequestRepository.find(requestId);

        if (requestToApprove.reciever !== currentUserId) {
            throw new ViewRequestException("Cannot Approve a Request that is not yours");
        }

        requestToApprove.status = ViewRequestStatus.APPROVED;

        return await this.viewRequestRepository.update(requestToApprove)
            .then((request: ViewRequestDTO) => toViewRequest(request));
    }
    public async denyViewRequest(requestId: string, currentUserId: string): Promise<ViewRequest> {
        const requestToApprove = await this.viewRequestRepository.find(requestId);

        if (requestToApprove.reciever !== currentUserId) {
            throw new ViewRequestException("Cannot Deny a Request that is not yours");
        }

        requestToApprove.status = ViewRequestStatus.DENIED;

        return await this.viewRequestRepository.update(requestToApprove)
            .then((request: ViewRequestDTO) => toViewRequest(request));
    }

}

const toViewRequest = (dto: ViewRequestDTO) => {
    return new ViewRequest(dto.requester, dto.reciever, dto.status, dto._id);
};
