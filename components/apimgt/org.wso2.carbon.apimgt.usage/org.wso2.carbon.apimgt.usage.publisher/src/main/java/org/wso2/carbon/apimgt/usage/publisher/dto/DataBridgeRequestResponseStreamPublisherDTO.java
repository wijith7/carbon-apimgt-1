/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.apimgt.usage.publisher.dto;

import java.util.ArrayList;

public class DataBridgeRequestResponseStreamPublisherDTO extends RequestResponseStreamDTO {

    public DataBridgeRequestResponseStreamPublisherDTO(RequestResponseStreamDTO requestResponseStreamDTO) {
        setApiContext(requestResponseStreamDTO.getApiContext());
        setApiHostname(requestResponseStreamDTO.getApiHostname());
        setApiMethod(requestResponseStreamDTO.getApiMethod());
        setApiName(requestResponseStreamDTO.getApiName());
        setApiCreatorTenantDomain(requestResponseStreamDTO.getApiCreatorTenantDomain());
        setApiCreator(requestResponseStreamDTO.getApiCreator());
        setApiResourcePath(requestResponseStreamDTO.getApiResourcePath());
        setApiResourceTemplate(requestResponseStreamDTO.getApiResourceTemplate());
        setApiTier(requestResponseStreamDTO.getApiTier());
        setApiVersion(requestResponseStreamDTO.getApiVersion());
        setApplicationConsumerKey(requestResponseStreamDTO.getApplicationConsumerKey());
        setApplicationId(requestResponseStreamDTO.getApplicationId());
        setApplicationName(requestResponseStreamDTO.getApplicationName());
        setApplicationOwner(requestResponseStreamDTO.getApplicationOwner());
        setBackendTime(requestResponseStreamDTO.getBackendTime());
        setDestination(requestResponseStreamDTO.getDestination());
        setExecutionTime(requestResponseStreamDTO.getExecutionTime());
        setMetaClientType(requestResponseStreamDTO.getMetaClientType()); 
        setProtocol(requestResponseStreamDTO.getProtocol());
        setRequestTimestamp(requestResponseStreamDTO.getRequestTimestamp());
        setResponseCacheHit(requestResponseStreamDTO.isResponseCacheHit());
        setResponseCode(requestResponseStreamDTO.getResponseCode());
        setResponseSize(requestResponseStreamDTO.getResponseSize());
        setServiceTime(requestResponseStreamDTO.getServiceTime());
        setThrottledOut(requestResponseStreamDTO.isThrottledOut());
        setUserAgent(requestResponseStreamDTO.getUserAgent());
        setUserIp(requestResponseStreamDTO.getUserIp());
        setUsername(requestResponseStreamDTO.getUsername());
        setUserTenantDomain(requestResponseStreamDTO.getUserTenantDomain());
        setGatewayType(requestResponseStreamDTO.getGatewayType());
        setLabel(requestResponseStreamDTO.getLabel());
        setResponseTime(requestResponseStreamDTO.getResponseTime());
    }

    public Object createPayload() {
        return new Object[] { getApplicationConsumerKey(), getApplicationName(),
                getApplicationId(), getApplicationOwner(), getApiContext(), getApiName(), getApiVersion(),
                getApiResourcePath(), getApiResourceTemplate(), getApiMethod(), getApiCreator(),
                getApiCreatorTenantDomain(), getApiTier(), getApiHostname(), getUsername(), getUserTenantDomain(),
                getUserIp(), getUserAgent(), getRequestTimestamp(), isThrottledOut(), getResponseTime(),
                getServiceTime(), getBackendTime(), isResponseCacheHit(), getResponseSize(), getProtocol(),
                getResponseCode(), getDestination(), getExecutionTime().getSecurityLatency(),
                getExecutionTime().getThrottlingLatency(), getExecutionTime().getRequestMediationLatency(),
                getExecutionTime().getResponseMediationLatency(), getExecutionTime().getBackEndLatency(),
                getExecutionTime().getOtherLatency(), getGatewayType(), getLabel() };

    }

    public Object[] createMetaData() {
        return new Object[] { getMetaClientType() };
    }

    public ArrayList<String> getMissingMandatoryValues() {
        ArrayList<String> missingMandatoryValues = new ArrayList<String>();
        if (getApplicationConsumerKey() == null) {
            missingMandatoryValues.add("Application consumer key");
        }
        if (getApplicationName() == null) {
            missingMandatoryValues.add("Application name");
        }
        if (getApplicationId() == null) {
            missingMandatoryValues.add("Application ID");
        }
        if (getApiContext() == null) {
            missingMandatoryValues.add("API context");
        }
        if (getApiName() == null) {
            missingMandatoryValues.add("API name");
        }
        if (getApiCreator() == null) {
            missingMandatoryValues.add("API creator");
        }
        if (getApiVersion() == null) {
            missingMandatoryValues.add("API version");
        }
        if (getApiResourceTemplate() == null) {
            missingMandatoryValues.add("API resource template");
        }
        if (getApiMethod() == null) {
            missingMandatoryValues.add("API method");
        }
        if (getApiCreator() == null) {
            missingMandatoryValues.add("API creator");
        }
        if (getApiCreatorTenantDomain() == null) {
            missingMandatoryValues.add("API creator tenant domain");
        }
        if (getApiHostname() == null) {
            missingMandatoryValues.add("API hostname");
        }
        if (getDestination() == null) {
            missingMandatoryValues.add("Destination");
        }
        if (getUserIp() == null) {
            missingMandatoryValues.add("User IP");
        }
        if (getUserAgent() == null) {
            missingMandatoryValues.add("User agent");
        }
        return missingMandatoryValues;
    }
}
