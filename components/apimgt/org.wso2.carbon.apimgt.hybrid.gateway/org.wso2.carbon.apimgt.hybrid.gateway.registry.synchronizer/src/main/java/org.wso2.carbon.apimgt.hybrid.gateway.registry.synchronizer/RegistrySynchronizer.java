/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.apimgt.hybrid.gateway.registry.synchronizer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.wso2.carbon.apimgt.hybrid.gateway.common.OnPremiseGatewayInitListener;
import org.wso2.carbon.apimgt.hybrid.gateway.common.config.ConfigManager;
import org.wso2.carbon.apimgt.hybrid.gateway.common.exception.OnPremiseGatewayException;
import org.wso2.carbon.apimgt.hybrid.gateway.common.util.OnPremiseGatewayConstants;
import org.wso2.carbon.apimgt.hybrid.gateway.registry.synchronizer.util.RegistryClient;
import org.wso2.carbon.apimgt.hybrid.gateway.registry.synchronizer.exceptions.RegistrySynchronizationException;
import org.wso2.carbon.context.PrivilegedCarbonContext;

/**
 * Class for synchronizing Registry upon initial server startup
 */
public class RegistrySynchronizer implements OnPremiseGatewayInitListener {
    private static final Logger log = LoggerFactory.getLogger(RegistrySynchronizer.class);

    @Override
    public void completedInitialization() {
            log.info("Started Synchronizing Registries");
            try {
                synchronizeRegistries();
            } catch (RegistrySynchronizationException e) {
                log.error("Registry synchronization failed", e);
            }
    }

    /**
     * Method to synchronize registries
     */
    public void synchronizeRegistries() throws RegistrySynchronizationException {
        String registryPath;
        String[] registryPathArray;
        try {
            registryPath = ConfigManager.getConfigManager()
                    .getProperty(OnPremiseGatewayConstants.REGISTRY_PATHS_PROPERTY_KEY);
            RegistryClient registryClient = new RegistryClient();

            if(registryPath != null){
                if(registryPath.contains(",")){
                    registryPathArray = registryPath.split(",");
                    for (int i = 0; i < registryPathArray.length; i++) {
                        registryClient.copyRegistryResourceFromRemoteToLocal(registryPathArray[i].trim());
                    }
                } else {
                    registryClient.copyRegistryResourceFromRemoteToLocal(registryPath.trim());
                }
            }
            log.info("Registry Synchronization completed");
        } catch (OnPremiseGatewayException e) {
            String errorMsg = "Resource copying from remote to local failed";
            log.error(errorMsg, e);
            throw new RegistrySynchronizationException(errorMsg, e);
        } finally {
            PrivilegedCarbonContext.endTenantFlow();
        }
    }

}
