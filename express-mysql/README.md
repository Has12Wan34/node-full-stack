## สรุปเนื้อหา
### `fundementals`
- `Image` :
    - เปรียบเสมือนกับเป็นต้นแบบในการสร้าง environment ตามที่เราอยากได้นั่นเอง
    - `Dockerfile` : คือชุดคำสั่งของ docker ที่เอาไว้สร้าง environment ในแบบที่เราต้องการ รวมถึงการตั้งค่าต่างๆ library ที่เราต้องการ และ source code พื้นฐานที่เราอยากให้มันมี
    - เมื่อเรานำ image มา run แล้วเราจะได้สิ่งที่เรียกว่า Container
    - image 1 ตัว เราจะให้มันไปสร้าง container กี่ตัวก็ได้
    - คำสั่ง : 
        - `docker build -t image_name`
        - `docker run -d -p port_local:port_container image_name`
    - ตัวอย่างโค้ด
        ```bash
        # กำหนดให้มันติดตั้ง version 
        FROM ...:...

        # กำหนด folder ที่จะทำงานด้วยไว้ที่ /app
        WORKDIR /app

        # สั่งให้มัน Copy ไฟล์ทุกอย่างใน folder ปัจจุบันไปใส่ไว้ใน /app ที่อยู่ใน container
        COPY . /app

        # ติดตั้ง packages ex. npm install, pip install Flask
        RUN ...

        # เปิด port 80 ให้กับ container เพื่อให้เครื่องเราสามารถเข้าใช้งาน port นี้ได้
        EXPOSE 80

        # ตั้งค่าตัวแปรต่างๆเพื่อเอาไปใช้ในการสร้าง environment
        ENV NAME World

        # สั่งให้มันรัน เมื่อ container ถูกสร้าง ex. ["npm", "start"], ["python", "app.py"]
        CMD ...
        ```
- `Container` 
    - เป็นส่วนของ Application และ Environment ที่ถูกสร้างขึ้นและจะทำงานตามคำสั่งที่ถูกกำหนดไว้ใน image
- `Docker registry`
    - docker hub :
        ```bash
            login : rbae1998425
            password : 0936816898 
        ```
    - เรียกอีกชื่อหนึ่งว่า Docker Hub เป็นส่วนที่นักพัฒนาจะทำการ Upload Docker image ของ Application ที่ตัวเองได้พัฒนาเก็บเอาไว้บน server ส่วนกลางเพื่อให้นักพัฒนาคนอื่นๆ สามารถ Download image ที่ต้องการมาใช้งานบน Docker server ได้
    - Docker registries มันจะมีรูปแบบในการเข้าถึง Image ของแต่ละคนเป็นรูปแบบนี้ username/repository:tag ซึ่งตัว Tag จริงๆจะใส่หรือไม่ใส่ก็ได้ แต่ทาง Docker แนะนำว่าให้ใส่ไว้จะดีกว่า เพราะมันเหมือนกับเป็นตัวบอกเวอร์ชั่นของ image ของเรานั่นเอง
    - tag : คำสั่ง `docker tag image username/repository:tag`
- `Docker Compose`
    - script คำสั่ง ที่เอาไว้สร้าง container หลายๆอันขึ้นมาพร้อมกัน โดยใช้คำสั่งเดียว
    - เราสามารถกำหนดไว้ในไฟล์ docker-compose.yml เลย ว่าใช้ services อะไรบ้าง ตั้งค่าไรบ้าง จากนั้นก็ใช้คำสั่ง run command เจ้า docker-compose โดยใช้คำสั่ง docker-compose up -d แค่บรรทัดเดียว มันก็จะทำการสร้าง container ทุกๆอันให้เราอัตโนมัติ ตามค่า config ที่เราตั้งไว้
    ```bash
        version - เป็น version ของ compose file format
        services - ส่วนของการระบุว่า เราจะมี service อะไรบ้างที่เราจะ compose ออกไป
        container_name - ชื่อของ Container หลังจากเราสั่ง compose แล้ว
        build - ระบุ path ไปยัง Dockerfile
        ports - ระบุ port ที่เราจะ expose ออกมาโดยจะเป็นดังนี้ HOST:CONTAINER
        network_mode - ระบุ type network ของ service เช่น host , bridge
        env_file - อ่าน Environment variable จากไฟล์ .env โดยใส่เป็น path ไปหาไฟล์
        environment - กำหนด Environment variable แบบกำหนด Value ลงไปได้
        depends_on - ระบุชื่อ service ที่เราต้องการจะเพิ่ม dependency ด้วย
        images - image ที่ต้องการใช้โดยจะเป็น local หรือ remote image ก็ได้
    ```