import { Col, Row, Typography, Tag } from 'antd';
import React from 'react';
const { Text } = Typography;

const InfoPage = () => {
    return (
        <div>
            <Row justify="space-between">
                <Col lg={16}><Typography.Title level={3}>Справка</Typography.Title></Col>
            </Row>
            <Text>
                Для создания задачи необходимо перейти на страницу Задачи и нажать кнопку Создать задачу.<br />
                Далее заполнить Заголовок (Тема задачи) и Описание (подробное описание задачи), при небходимости приложите файлы к задаче,<br />
                список поддерживаемых файлов jpeg, jpg, png, doc, docx, xls, xlsx, xml, txt размер файла не должен превышать 5 Мб.<br />
                После создания задачи, статус задачи будет установлен как <Tag color="blue">Обработка</Tag>, в этот момент менеджер начинает обрабатывать вашу задачу, <br />
                и после того как менеджер обработает вашу задачу статус изменится.
            </Text>
        </div>
    )
}

export default InfoPage;