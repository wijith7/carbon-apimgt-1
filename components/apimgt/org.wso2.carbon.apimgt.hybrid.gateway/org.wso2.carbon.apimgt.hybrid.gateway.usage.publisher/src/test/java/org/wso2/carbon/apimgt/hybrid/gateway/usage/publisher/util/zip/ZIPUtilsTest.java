/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.wso2.carbon.apimgt.hybrid.gateway.usage.publisher.util.zip;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.wso2.carbon.apimgt.hybrid.gateway.usage.publisher.TestUtil;
import org.wso2.carbon.apimgt.hybrid.gateway.usage.publisher.constants.Constants;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * ZIPUtils Test Class
 */
@RunWith(PowerMockRunner.class)
@PrepareForTest({ZIPUtils.class})
public class ZIPUtilsTest {
    @Before
    public void setUp() throws Exception {
        TestUtil util = new TestUtil();
        util.setupCarbonHome();
    }

    @Test
    public void compressFile() throws Exception {
        String destPath = System.getProperty(Constants.CARBON_HOME) + File.separator +
                "api-usage-data/temp/api-usage-data.dat.1511772769858.046b6c7f-0b8a-43b9-b35d-6489e6daee91.zip";
        String srcPath = System.getProperty(Constants.CARBON_HOME) + File.separator +
                "api-usage-data/api-usage-data.dat.1511772769858.046b6c7f-0b8a-43b9-b35d-6489e6daee91";
        ZIPUtils.compressFile(srcPath, destPath);
    }

    @Test
    public void compressFile_throwsException() throws Exception {
        String destPath = System.getProperty(Constants.CARBON_HOME) + File.separator +
                "api-usage-data/temp/api-usage-data.dat.1511772769858.046b6c7f-0b8a-43b9-b35d-6489e6daee91.zip";
        String srcPath = System.getProperty(Constants.CARBON_HOME) + File.separator +
                "api-usage-data/api-usage-data.dat.1511772769858.046b6c7f-0b8a-43b9-b35d-6489e6daee91";
        FileOutputStream fileOutputStream = Mockito.spy(new FileOutputStream(destPath));
        PowerMockito.whenNew(FileOutputStream.class).withAnyArguments().thenReturn(fileOutputStream);
        ZIPUtils.compressFile(srcPath, destPath);
    }

    @AfterClass
    public static void cleanUp() throws Exception {
        //Deleting the file
        String destPath = System.getProperty(Constants.CARBON_HOME) + File.separator +
                "api-usage-data/temp/api-usage-data.dat.1511772769858.046b6c7f-0b8a-43b9-b35d-6489e6daee91.zip";
        Path filePath = Paths.get(destPath);
        Files.delete(filePath);
    }
}
